import socket
import logging
import ipaddress
import requests

logger = logging.getLogger(__name__)


class IPService:
    """Service for getting IP information and geolocation"""

    def __init__(self):
        self.timeout = 10
        self.private_ranges = [
            ipaddress.IPv4Network('10.0.0.0/8'),
            ipaddress.IPv4Network('172.16.0.0/12'),
            ipaddress.IPv4Network('192.168.0.0/16'),
            ipaddress.IPv4Network('127.0.0.0/8'),
            ipaddress.IPv4Network('169.254.0.0/16'),
        ]

    def get_ip_info(self, hostname):
        """Get IP information for a hostname"""
        try:
            # Resolve hostname to IP
            ip_address = self._resolve_hostname(hostname)

            if not ip_address:
                return {
                    'hostname': hostname,
                    'error': 'Could not resolve hostname',
                    'is_valid': False
                }

            # Check if IP is private
            is_private = self._is_private_ip(ip_address)

            # Try to get geolocation
            geo_info = self._get_geolocation(ip_address) if not is_private else None

            # Reverse DNS lookup
            reverse_dns = self._reverse_dns_lookup(ip_address)

            result = {
                'hostname': hostname,
                'ip': ip_address,
                'is_valid': True,
                'is_private': is_private,
                'ip_type': self._get_ip_type(ip_address),
                'reverse_dns': reverse_dns,
                'geolocation': geo_info or {},
                'risk_level': self._assess_ip_risk(ip_address, is_private)
            }

            return result

        except Exception as e:
            logger.error(f"Error getting IP info: {str(e)}")
            return {
                'hostname': hostname,
                'error': str(e),
                'is_valid': False
            }

    def _resolve_hostname(self, hostname):
        """Resolve hostname to IP address"""
        try:
            # Try IPv4 first
            result = socket.getaddrinfo(hostname, None, socket.AF_INET)
            if result:
                return result[0][4][0]
        except socket.gaierror:
            try:
                # Try IPv6
                result = socket.getaddrinfo(hostname, None, socket.AF_INET6)
                if result:
                    return result[0][4][0]
            except socket.gaierror:
                pass

        return None

    def _is_private_ip(self, ip_str):
        """Check if IP is private"""
        try:
            ip_obj = ipaddress.ip_address(ip_str)

            if isinstance(ip_obj, ipaddress.IPv4Address):
                return any(ip_obj in net for net in self.private_ranges)

            if isinstance(ip_obj, ipaddress.IPv6Address):
                return ip_obj.is_private

            return False
        except ValueError:
            return False

    def _get_ip_type(self, ip_str):
        """Determine IP type"""
        try:
            ip_obj = ipaddress.ip_address(ip_str)

            if isinstance(ip_obj, ipaddress.IPv4Address):
                if ip_obj.is_loopback:
                    return 'loopback'
                if ip_obj.is_link_local:
                    return 'link_local'
                if ip_obj.is_private:
                    return 'private'
                if ip_obj.is_multicast:
                    return 'multicast'
                return 'public'

            if isinstance(ip_obj, ipaddress.IPv6Address):
                if ip_obj.is_loopback:
                    return 'loopback'
                if ip_obj.is_link_local:
                    return 'link_local'
                if ip_obj.is_private:
                    return 'private'
                if ip_obj.is_multicast:
                    return 'multicast'
                return 'public'

            return 'unknown'
        except ValueError:
            return 'unknown'

    def _reverse_dns_lookup(self, ip_address):
        """Perform reverse DNS lookup"""
        try:
            hostname, _, _ = socket.gethostbyaddr(ip_address)
            return hostname
        except (socket.herror, socket.error):
            return None

    def _get_geolocation(self, ip_address):
        """Get geolocation information from IP"""
        try:
            # Using ip-api.com free endpoint
            response = requests.get(
                f'http://ip-api.com/json/{ip_address}',
                timeout=self.timeout,
                params={'fields': 'status,country,countryCode,region,regionName,city,lat,lon,isp,org,as'}
            )

            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success':
                    return {
                        'country': data.get('country'),
                        'country_code': data.get('countryCode'),
                        'region': data.get('region'),
                        'region_name': data.get('regionName'),
                        'city': data.get('city'),
                        'latitude': data.get('lat'),
                        'longitude': data.get('lon'),
                        'isp': data.get('isp'),
                        'organization': data.get('org'),
                        'as_number': data.get('as')
                    }
        except Exception as e:
            logger.warning(f"Could not get geolocation: {str(e)}")

        return None

    def _assess_ip_risk(self, ip_address, is_private):
        """Assess risk level of IP"""
        if is_private:
            return 'medium'

        try:
            ip_obj = ipaddress.ip_address(ip_address)

            if ip_obj.is_reserved:
                return 'high'

            if isinstance(ip_obj, ipaddress.IPv4Address):
                if ip_obj.is_multicast:
                    return 'medium'

            return 'low'
        except ValueError:
            return 'medium'
