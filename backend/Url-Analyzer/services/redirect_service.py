import requests
import logging
from urllib.parse import urljoin, urlparse

logger = logging.getLogger(__name__)


class RedirectService:
    """Service for analyzing URL redirects"""

    def __init__(self, timeout=10, max_redirects=10):
        self.timeout = timeout
        self.max_redirects = max_redirects
        self.session = requests.Session()
        self.session.max_redirects = max_redirects

    def check_redirects(self, url):
        """Check for redirects and analyze redirect chain"""
        try:
            redirect_chain = []
            final_url = None

            # Manual redirect following to capture all redirects
            current_url = url
            visited = set()

            for i in range(self.max_redirects):
                if current_url in visited:
                    return {
                        'url': url,
                        'has_redirects': True,
                        'redirect_count': len(redirect_chain),
                        'redirects': redirect_chain,
                        'final_url': current_url,
                        'is_circular': True,
                        'risk_level': 'high'
                    }

                visited.add(current_url)

                try:
                    response = self.session.head(
                        current_url,
                        timeout=self.timeout,
                        allow_redirects=False,
                        headers={'User-Agent': 'Mozilla/5.0'}
                    )

                    status_code = response.status_code

                    if status_code in [301, 302, 303, 307, 308]:
                        next_url = response.headers.get('Location')
                        if next_url:
                            # Handle relative URLs
                            if not next_url.startswith(('http://', 'https://')):
                                next_url = urljoin(current_url, next_url)

                            redirect_chain.append({
                                'from': current_url,
                                'to': next_url,
                                'status_code': status_code,
                                'status_text': self._get_status_text(status_code),
                                'headers': dict(response.headers)
                            })

                            current_url = next_url
                        else:
                            final_url = current_url
                            break
                    else:
                        final_url = current_url
                        break

                except requests.exceptions.Timeout:
                    redirect_chain.append({
                        'from': current_url,
                        'error': 'Timeout',
                        'is_error': True
                    })
                    break
                except requests.exceptions.ConnectionError:
                    redirect_chain.append({
                        'from': current_url,
                        'error': 'Connection Error',
                        'is_error': True
                    })
                    break
                except Exception as e:
                    redirect_chain.append({
                        'from': current_url,
                        'error': str(e),
                        'is_error': True
                    })
                    break

            risk_level = self._assess_redirect_risk(redirect_chain, url, final_url)

            return {
                'url': url,
                'has_redirects': len(redirect_chain) > 0,
                'redirect_count': len(redirect_chain),
                'redirects': redirect_chain,
                'final_url': final_url or current_url,
                'is_circular': current_url in visited and len(visited) > 1,
                'has_errors': any(r.get('is_error') for r in redirect_chain),
                'risk_level': risk_level,
                'suspicious_redirects': self._find_suspicious_redirects(redirect_chain)
            }

        except Exception as e:
            logger.error(f"Error checking redirects: {str(e)}")
            return {
                'url': url,
                'error': str(e),
                'has_redirects': False,
                'redirects': []
            }

    def _get_status_text(self, status_code):
        """Get HTTP status text"""
        status_map = {
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            307: 'Temporary Redirect',
            308: 'Permanent Redirect'
        }
        return status_map.get(status_code, 'Unknown')

    def _assess_redirect_risk(self, redirect_chain, original_url, final_url):
        """Assess risk level of redirect chain"""
        if not redirect_chain:
            return 'low'

        # Check for domain changes
        original_domain = urlparse(original_url).hostname
        final_domain = urlparse(final_url).hostname if final_url else None

        if original_domain != final_domain:
            # Multi-hop redirects to different domain = higher risk
            if len(redirect_chain) > 2:
                return 'high'
            return 'medium'

        # Many redirects = suspicious
        if len(redirect_chain) > 5:
            return 'high'

        if len(redirect_chain) > 2:
            return 'medium'

        return 'low'

    def _find_suspicious_redirects(self, redirect_chain):
        """Find suspicious redirects in the chain"""
        suspicious = []

        for redirect in redirect_chain:
            if redirect.get('is_error'):
                suspicious.append({
                    'type': 'error',
                    'redirect': redirect
                })

            if redirect.get('to'):
                from_domain = urlparse(redirect['from']).hostname
                to_domain = urlparse(redirect['to']).hostname
                if from_domain != to_domain:
                    suspicious.append({
                        'type': 'cross_domain',
                        'from': redirect['from'],
                        'to': redirect['to']
                    })

        return suspicious
