import re
from urllib.parse import urlparse, parse_qs, unquote
import logging

logger = logging.getLogger(__name__)


class URLParserService:
    """Service for parsing and analyzing URL structure"""

    def __init__(self):
        self.suspicious_patterns = [
            r'javascript:',
            r'data:',
            r'vbscript:',
            r'about:',
            r'file://',
            r'telnet:',
            r'ftp:',
        ]
        self.suspicious_keywords = [
            'admin', 'login', 'signin', 'update', 'verify', 'confirm',
            'account', 'password', 'urgent', 'action', 'click'
        ]

    def parse(self, url):
        """Parse URL into components and analyze structure"""
        try:
            # Add scheme if missing
            if not url.startswith(('http://', 'https://', 'ftp://')):
                url = 'https://' + url

            parsed = urlparse(url)

            result = {
                'original_url': url,
                'is_valid': self._is_valid_url(url),
                'scheme': parsed.scheme,
                'hostname': parsed.hostname,
                'port': parsed.port,
                'path': parsed.path or '/',
                'query': parsed.query,
                'fragment': parsed.fragment,
                'username': parsed.username,
                'password': parsed.password,
                'netloc': parsed.netloc,
                'components': self._extract_components(parsed),
                'path_analysis': self._analyze_path(parsed.path),
                'query_analysis': self._analyze_query(parsed.query),
                'suspicious_indicators': self._check_suspicious(url, parsed),
                'risk_level': 'low'
            }

            # Set risk level
            if result['suspicious_indicators']:
                result['risk_level'] = 'high' if len(result['suspicious_indicators']) > 2 else 'medium'

            return result

        except Exception as e:
            logger.error(f"Error parsing URL: {str(e)}")
            return {
                'is_valid': False,
                'error': str(e),
                'original_url': url
            }

    def _is_valid_url(self, url):
        """Validate URL format"""
        url_pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        return bool(re.match(url_pattern, url, re.IGNORECASE))

    def _extract_components(self, parsed):
        """Extract URL components for easy access"""
        return {
            'subdomain': self._extract_subdomain(parsed.hostname),
            'domain': self._extract_domain(parsed.hostname),
            'tld': self._extract_tld(parsed.hostname),
            'full_hostname': parsed.hostname,
        }

    def _extract_subdomain(self, hostname):
        """Extract subdomain from hostname"""
        if not hostname:
            return None
        parts = hostname.split('.')
        if len(parts) > 2:
            return '.'.join(parts[:-2])
        return None

    def _extract_domain(self, hostname):
        """Extract domain from hostname"""
        if not hostname:
            return None
        parts = hostname.split('.')
        if len(parts) >= 2:
            return parts[-2]
        return parts[0] if parts else None

    def _extract_tld(self, hostname):
        """Extract TLD from hostname"""
        if not hostname:
            return None
        parts = hostname.split('.')
        return parts[-1] if parts else None

    def _analyze_path(self, path):
        """Analyze URL path structure"""
        if not path or path == '/':
            return {
                'path': path,
                'segments': [],
                'depth': 0,
                'has_file': False,
                'file_name': None,
                'suspicious_segments': []
            }

        segments = [seg for seg in path.split('/') if seg]
        file_name = None
        has_file = False

        if segments and '.' in segments[-1]:
            file_name = segments[-1]
            has_file = True
            segments = segments[:-1]

        suspicious_segments = [seg for seg in segments if self._is_suspicious_segment(seg)]

        return {
            'path': path,
            'segments': segments,
            'depth': len(segments),
            'has_file': has_file,
            'file_name': file_name,
            'suspicious_segments': suspicious_segments,
            'is_suspicious': len(suspicious_segments) > 0
        }

    def _analyze_query(self, query):
        """Analyze query parameters"""
        if not query:
            return {
                'query_string': query,
                'parameters': [],
                'count': 0,
                'suspicious_params': []
            }

        params = []
        suspicious_params = []

        try:
            parsed_params = parse_qs(query)
            for key, values in parsed_params.items():
                param_info = {
                    'key': key,
                    'values': values,
                    'is_suspicious': self._is_suspicious_param(key, values)
                }
                params.append(param_info)

                if param_info['is_suspicious']:
                    suspicious_params.append(key)

        except Exception as e:
            logger.warning(f"Could not parse query string: {str(e)}")

        return {
            'query_string': query,
            'parameters': params,
            'count': len(params),
            'suspicious_params': suspicious_params,
            'is_suspicious': len(suspicious_params) > 0
        }

    def _is_suspicious_segment(self, segment):
        """Check if path segment is suspicious"""
        lower_segment = segment.lower()
        return any(keyword in lower_segment for keyword in self.suspicious_keywords)

    def _is_suspicious_param(self, key, values):
        """Check if query parameter is suspicious"""
        lower_key = key.lower()
        suspicious_keys = ['id', 'token', 'session', 'user', 'pass', 'email', 'admin']
        return any(skey in lower_key for skey in suspicious_keys)

    def _check_suspicious(self, url, parsed):
        """Check for suspicious patterns in URL"""
        suspicious = []

        # Check protocol
        if parsed.scheme not in ['http', 'https']:
            suspicious.append(f"Unusual protocol: {parsed.scheme}")

        # Check for suspicious patterns
        lower_url = url.lower()
        for pattern in self.suspicious_patterns:
            if re.search(pattern, lower_url):
                suspicious.append(f"Suspicious pattern detected: {pattern}")

        # Check for credentials in URL
        if parsed.username or parsed.password:
            suspicious.append("Credentials in URL detected")

        # Check for obfuscated IP
        if self._is_obfuscated_ip(parsed.hostname):
            suspicious.append("Obfuscated IP address detected")

        # Check for very long path
        if len(parsed.path) > 255:
            suspicious.append("Extremely long path detected")

        # Check for null bytes
        if '\x00' in url:
            suspicious.append("Null byte in URL detected")

        # Check for double encoding
        if '%25' in url:
            suspicious.append("Double URL encoding detected")

        return suspicious

    def _is_obfuscated_ip(self, hostname):
        """Check if hostname is an obfuscated IP"""
        if not hostname:
            return False

        # Check for hex IP notation
        if hostname.startswith('0x'):
            return True

        # Check for octal notation
        parts = hostname.split('.')
        if len(parts) <= 2:
            try:
                if all(part.startswith('0') and len(part) > 1 for part in parts):
                    return True
            except:
                pass

        return False
