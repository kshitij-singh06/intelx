# URL Analyzer

A comprehensive Flask-based URL analysis service that breaks down URLs, analyzes their components, checks safety indicators, and traces network hops.

## Features

### URL Parsing & Analysis
- **URL Component Breakdown**: Extracts scheme, hostname, port, path, query parameters, and fragments
- **Path Analysis**: Analyzes path segments, detects suspicious keywords, file extensions
- **Query Parameter Analysis**: Parses and analyzes query strings for suspicious parameters
- **Suspicious Pattern Detection**: Detects obfuscated IPs, double encoding, null bytes, credentials in URL

### Redirect Analysis
- **Redirect Chain Tracking**: Follows and logs all redirects
- **Cross-Domain Detection**: Identifies redirects to different domains
- **Redirect Risk Assessment**: Evaluates risk based on number and type of redirects
- **Circular Redirect Detection**: Detects redirect loops

### SSL/TLS Certificate Verification
- **Certificate Validity Check**: Verifies certificate expiration and validity
- **Self-Signed Detection**: Identifies self-signed certificates
- **Cipher Analysis**: Analyzes encryption strength and protocol version
- **Certificate Details**: Extracts issuer, subject, SANs, and validity dates

### IP Information
- **IP Resolution**: Resolves hostname to IP addresses
- **Private IP Detection**: Identifies private and reserved IPs
- **Reverse DNS Lookup**: Performs reverse DNS resolution
- **Geolocation**: Provides geographic information for public IPs
- **IP Type Classification**: Identifies IP type (public, private, loopback, etc.)

### Network Hop Tracing
- **Traceroute Analysis**: Traces network path to destination
- **Response Time Analysis**: Measures and analyzes response times at each hop
- **Timeout Detection**: Identifies unreachable hops
- **Network Path Visualization**: Provides hop-by-hop path information

### Malware & Phishing Detection
- **URLhaus Integration**: Checks against URLhaus malware database
- **PhishTank Integration**: Checks against phishing database (requires API key)
- **Google Safe Browsing**: Integration ready (requires API key)
- **VirusTotal Integration**: Integration ready (requires API key)

### Safety Scoring
- **Comprehensive Risk Assessment**: Calculates overall safety score (0-100)
- **Multi-Factor Analysis**: Combines multiple security indicators
- **Risk Level Classification**: Low, Medium, High risk levels

## API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-18T10:30:00"
}
```

### Comprehensive URL Analysis
```
POST /api/analyze
Content-Type: application/json

{
  "url": "https://example.com/path?param=value"
}
```

Response includes:
- URL parsing results
- Redirect analysis
- SSL/TLS certificate info
- IP information
- Network hops
- Malware checks
- Overall safety score

### URL Parsing
```
POST /api/parse
Content-Type: application/json

{
  "url": "https://example.com/path"
}
```

### Check Redirects
```
POST /api/redirects
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Check SSL/TLS
```
POST /api/ssl
Content-Type: application/json

{
  "hostname": "example.com"
}
```

### Get IP Information
```
POST /api/ip
Content-Type: application/json

{
  "hostname": "example.com"
}
```

### Trace Network Hops
```
POST /api/hops
Content-Type: application/json

{
  "ip": "93.184.216.34"
}
```

### Check Malware
```
POST /api/malware
Content-Type: application/json

{
  "url": "https://example.com"
}
```

## Running with Docker

### Build Image
```bash
docker build -t url-analyzer .
```

### Run Container
```bash
docker run -p 5000:5000 url-analyzer
```

### Using Docker Compose
```bash
docker-compose up
```

## Local Development

### Prerequisites
- Python 3.11+
- `traceroute` (Linux/macOS) or `tracert` (Windows)

### Installation
```bash
pip install -r requirements.txt
```

### Running
```bash
python app.py
```

The application will start on `http://localhost:5000`

## Configuration

Environment variables:
- `FLASK_ENV`: Set to `production` for production deployment
- `PYTHONUNBUFFERED`: Set to `1` for immediate output in Docker

## Safety Score Calculation

The safety score is calculated as follows:
- Start with 100 points
- Invalid URL format: -20 points
- Each redirect: -5 points (max -15)
- Invalid SSL certificate: -15 points
- Malicious URL detected: -30 points

## Risk Levels

- **Low**: Score >= 70, no suspicious indicators
- **Medium**: Score 40-69, some suspicious indicators
- **High**: Score < 40, multiple suspicious indicators or malicious detection

## Integration with Other Services

This service can be integrated with:
- **Web-Analyzer**: For comprehensive website analysis
- **Malware-Analyzer**: For deeper file analysis of downloaded content
- **Steg-Analyzer**: For analyzing steganographic content

## Testing

### Example Request
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

## Notes

- Some external API integrations (Google Safe Browsing, PhishTank, VirusTotal) require API keys
- URLhaus is available without API key
- Traceroute functionality requires elevated privileges on some systems
- Response times depend on network conditions and destination availability
- Geolocation data is approximate and provided for informational purposes only

## License

Part of IntelX security analysis platform
