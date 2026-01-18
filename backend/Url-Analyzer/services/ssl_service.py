import ssl
import socket
import logging
from datetime import datetime
from urllib.parse import urlparse
import OpenSSL

logger = logging.getLogger(__name__)


class SSLService:
    """Service for checking SSL/TLS certificates"""

    def __init__(self, timeout=10):
        self.timeout = timeout

    def check_ssl(self, hostname):
        """Check SSL/TLS certificate validity and details"""
        try:
            # Remove port if present
            if ':' in hostname:
                hostname = hostname.split(':')[0]

            port = 443
            context = ssl.create_default_context()

            try:
                with socket.create_connection((hostname, port), timeout=self.timeout) as sock:
                    with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                        cert_der = ssock.getpeercert(binary_form=True)
                        cert = ssock.getpeercert()
                        cipher = ssock.cipher()
                        version = ssock.version()

                        cert_analysis = self._analyze_certificate(cert, cert_der)
                        cipher_analysis = self._analyze_cipher(cipher)

                        return {
                            'hostname': hostname,
                            'status': 'success',
                            'is_valid': cert_analysis['is_valid'],
                            'certificate': cert_analysis,
                            'cipher': cipher_analysis,
                            'tls_version': version,
                            'risk_level': self._assess_ssl_risk(cert_analysis, cipher_analysis, version)
                        }

            except ssl.SSLError as e:
                return {
                    'hostname': hostname,
                    'status': 'error',
                    'is_valid': False,
                    'error': f"SSL Error: {str(e)}",
                    'risk_level': 'high'
                }

        except socket.timeout:
            return {
                'hostname': hostname,
                'status': 'error',
                'is_valid': False,
                'error': 'Connection timeout',
                'risk_level': 'medium'
            }
        except Exception as e:
            logger.error(f"Error checking SSL: {str(e)}")
            return {
                'hostname': hostname,
                'status': 'error',
                'is_valid': False,
                'error': str(e),
                'risk_level': 'medium'
            }

    def _analyze_certificate(self, cert, cert_der=None):
        """Analyze certificate details"""
        try:
            subject = dict(x[0] for x in cert.get('subject', []))
            issuer = dict(x[0] for x in cert.get('issuer', []))

            # Parse dates
            not_before = datetime.strptime(cert.get('notBefore', ''), '%b %d %H:%M:%S %Y %Z')
            not_after = datetime.strptime(cert.get('notAfter', ''), '%b %d %H:%M:%S %Y %Z')
            now = datetime.utcnow()

            is_expired = now > not_after
            is_valid_now = not_before <= now <= not_after
            days_until_expiry = (not_after - now).days

            # Parse SANs
            san_list = []
            for sub in cert.get('subjectAltName', []):
                if sub[0] == 'DNS':
                    san_list.append(sub[1])

            analysis = {
                'subject': {
                    'common_name': subject.get('commonName', ''),
                    'organization': subject.get('organizationName', ''),
                    'country': subject.get('countryName', '')
                },
                'issuer': {
                    'common_name': issuer.get('commonName', ''),
                    'organization': issuer.get('organizationName', ''),
                    'country': issuer.get('countryName', '')
                },
                'valid_from': not_before.isoformat(),
                'valid_until': not_after.isoformat(),
                'is_expired': is_expired,
                'is_valid_now': is_valid_now,
                'days_until_expiry': max(0, days_until_expiry),
                'subject_alternative_names': san_list,
                'is_self_signed': self._is_self_signed(subject, issuer),
                'is_valid': is_valid_now and not is_expired
            }

            return analysis

        except Exception as e:
            logger.error(f"Error analyzing certificate: {str(e)}")
            return {
                'error': str(e),
                'is_valid': False
            }

    def _is_self_signed(self, subject, issuer):
        """Check if certificate is self-signed"""
        return subject == issuer

    def _analyze_cipher(self, cipher):
        """Analyze cipher strength"""
        if not cipher:
            return {'error': 'No cipher information'}

        cipher_name, protocol, bits = cipher

        # Weak ciphers
        weak_ciphers = ['DES', 'RC4', 'MD5', 'NULL', 'EXPORT']
        is_weak = any(weak in cipher_name for weak in weak_ciphers)

        # Weak protocols
        weak_protocols = ['SSLv2', 'SSLv3', 'TLSv1']
        is_weak_protocol = any(proto in protocol for proto in weak_protocols)

        risk_level = 'low'
        if is_weak or is_weak_protocol:
            risk_level = 'high'
        elif bits < 128:
            risk_level = 'high'
        elif bits < 256:
            risk_level = 'medium'

        return {
            'name': cipher_name,
            'protocol': protocol,
            'bits': bits,
            'is_weak': is_weak,
            'is_weak_protocol': is_weak_protocol,
            'risk_level': risk_level
        }

    def _assess_ssl_risk(self, cert_analysis, cipher_analysis, tls_version):
        """Assess overall SSL/TLS risk"""
        if not cert_analysis.get('is_valid'):
            return 'high'

        if cert_analysis.get('is_self_signed'):
            return 'high'

        if cert_analysis.get('days_until_expiry', 0) < 30:
            return 'medium'

        if cipher_analysis.get('risk_level') == 'high':
            return 'high'

        if cipher_analysis.get('risk_level') == 'medium':
            return 'medium'

        if 'TLSv1' in str(tls_version) and 'TLSv1.2' not in str(tls_version) and 'TLSv1.3' not in str(tls_version):
            return 'medium'

        return 'low'
