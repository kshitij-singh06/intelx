import subprocess
import socket
import logging
import platform
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

logger = logging.getLogger(__name__)


class HopService:
    """Service for tracing network hops to destination"""

    def __init__(self, timeout=60, max_hops=30):
        self.timeout = timeout
        self.max_hops = max_hops
        self.os_type = platform.system()

    def trace_hops(self, destination):
        """Trace hops to destination using traceroute/tracert"""
        try:
            # Resolve hostname if needed
            if not self._is_ip(destination):
                ip = self._resolve_hostname(destination)
                if not ip:
                    return {
                        'destination': destination,
                        'error': 'Could not resolve hostname',
                        'hops': []
                    }
                destination_ip = ip
            else:
                destination_ip = destination

            hops = self._run_traceroute(destination_ip)

            return {
                'destination': destination,
                'destination_ip': destination_ip,
                'hops_count': len(hops),
                'hops': hops,
                'analysis': self._analyze_hops(hops),
                'risk_level': self._assess_traceroute_risk(hops)
            }

        except Exception as e:
            logger.error(f"Error tracing hops: {str(e)}")
            return {
                'destination': destination,
                'error': str(e),
                'hops': []
            }

    def _is_ip(self, value):
        """Check if value is an IP address"""
        try:
            socket.inet_aton(value)
            return True
        except socket.error:
            return False

    def _resolve_hostname(self, hostname):
        """Resolve hostname to IP"""
        try:
            return socket.gethostbyname(hostname)
        except socket.gaierror:
            return None

    def _run_traceroute(self, destination):
        """Run traceroute command and parse output"""
        hops = []

        try:
            if self.os_type == 'Windows':
                cmd = ['tracert', '-h', str(self.max_hops), '-w', str(self.timeout * 1000), destination]
            else:  # Linux/macOS
                cmd = ['traceroute', '-m', str(self.max_hops), '-w', str(self.timeout), destination]

            result = subprocess.run(
                cmd,
                capture_output=True,
                timeout=self.timeout + 10,
                text=True
            )

            hops = self._parse_traceroute_output(result.stdout, self.os_type)

        except subprocess.TimeoutExpired:
            logger.warning(f"Traceroute timeout for {destination}")
        except FileNotFoundError:
            logger.warning(f"Traceroute command not found for {self.os_type}")
        except Exception as e:
            logger.error(f"Error running traceroute: {str(e)}")

        return hops

    def _parse_traceroute_output(self, output, os_type):
        """Parse traceroute output"""
        hops = []

        if os_type == 'Windows':
            hops = self._parse_tracert_output(output)
        else:
            hops = self._parse_traceroute_unix_output(output)

        return hops

    def _parse_tracert_output(self, output):
        """Parse Windows tracert output"""
        hops = []
        hop_number = 0

        for line in output.split('\n'):
            if not line.strip():
                continue

            # Match lines like: "  1    <1 ms    <1 ms    <1 ms  192.168.1.1"
            match = re.match(r'\s*(\d+)\s+([<\d]+\s+ms|[*])\s+([<\d]+\s+ms|[*])\s+([<\d]+\s+ms|[*])\s+(.+)', line)

            if match:
                hop_number = int(match.group(1))
                response1 = match.group(2).strip()
                response2 = match.group(3).strip()
                response3 = match.group(4).strip()
                host_info = match.group(5).strip()

                # Parse host info (IP or hostname)
                ip_address = None
                hostname = None

                # Try to extract IP
                ip_match = re.search(r'(\d+\.\d+\.\d+\.\d+)', host_info)
                if ip_match:
                    ip_address = ip_match.group(1)
                    hostname = host_info.replace(ip_address, '').strip()
                else:
                    hostname = host_info

                hops.append({
                    'hop_number': hop_number,
                    'hostname': hostname if hostname else None,
                    'ip': ip_address,
                    'response_times': [response1, response2, response3],
                    'is_timeout': '*' in response1 or '*' in response2 or '*' in response3
                })

        return hops

    def _parse_traceroute_unix_output(self, output):
        """Parse Unix traceroute output"""
        hops = []

        for line in output.split('\n'):
            if not line.strip() or line.startswith('traceroute'):
                continue

            # Match lines like: "1  gateway.local (192.168.1.1)  1.234 ms  1.345 ms  1.456 ms"
            match = re.match(r'\s*(\d+)\s+(.+)', line)

            if match:
                hop_number = int(match.group(1))
                rest = match.group(2)

                # Extract hostname and IP
                hostname = None
                ip_address = None

                # Try to find (IP) pattern
                ip_match = re.search(r'\(([^)]+)\)', rest)
                if ip_match:
                    ip_address = ip_match.group(1)
                    hostname_part = rest[:ip_match.start()].strip()
                    hostname = hostname_part if hostname_part else None

                # Extract response times
                times_match = re.findall(r'([\d.]+\s+ms)', rest)
                response_times = [t.strip() for t in times_match]

                is_timeout = '*' in rest and not response_times

                hops.append({
                    'hop_number': hop_number,
                    'hostname': hostname,
                    'ip': ip_address,
                    'response_times': response_times,
                    'is_timeout': is_timeout
                })

        return hops

    def _analyze_hops(self, hops):
        """Analyze hop information"""
        analysis = {
            'total_hops': len(hops),
            'timeouts': len([h for h in hops if h.get('is_timeout')]),
            'average_response_time': self._calculate_average_response_time(hops),
            'longest_response_time': self._get_longest_response_time(hops),
            'suspicious_hops': []
        }

        # Find suspicious hops
        for hop in hops:
            if hop.get('is_timeout'):
                analysis['suspicious_hops'].append({
                    'hop_number': hop['hop_number'],
                    'reason': 'Timeout - unreachable hop'
                })

        return analysis

    def _calculate_average_response_time(self, hops):
        """Calculate average response time"""
        times = []

        for hop in hops:
            for response_time in hop.get('response_times', []):
                try:
                    ms = float(response_time.replace('ms', '').strip())
                    times.append(ms)
                except ValueError:
                    pass

        return sum(times) / len(times) if times else 0

    def _get_longest_response_time(self, hops):
        """Get longest response time"""
        max_time = 0

        for hop in hops:
            for response_time in hop.get('response_times', []):
                try:
                    ms = float(response_time.replace('ms', '').strip())
                    max_time = max(max_time, ms)
                except ValueError:
                    pass

        return max_time

    def _assess_traceroute_risk(self, hops):
        """Assess risk level based on hops"""
        if not hops:
            return 'medium'

        timeout_count = len([h for h in hops if h.get('is_timeout')])
        timeout_ratio = timeout_count / len(hops) if hops else 0

        if timeout_ratio > 0.5:
            return 'high'

        if timeout_count > 5:
            return 'medium'

        return 'low'
