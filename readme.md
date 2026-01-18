<div align="center">

# IntelX

### Comprehensive Security Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>A modular security analysis platform with five specialized microservices for malware detection, steganography analysis, reconnaissance, URL safety verification, and web vulnerability assessment.</strong>
</p>

---

[Features](#features) · [Architecture](#architecture) · [Quick Start](#quick-start) · [API Reference](#api-reference) · [Documentation](#documentation)

</div>

---

## Overview

IntelX is an all-in-one security intelligence platform designed for threat analysts, security researchers, and SOC teams. It provides automated analysis capabilities through a unified API gateway, enabling rapid assessment of files, URLs, domains, and web applications.

## Features

<table>
<tr>
<td width="50%">

### Malware Analyzer
- Binary decompilation via Ghidra
- VirusTotal integration
- Static file analysis
- YARA rule matching

</td>
<td width="50%">

### Steg Analyzer
- Steganography detection
- Hidden data extraction
- Support for PNG, JPEG, BMP, GIF
- Multiple detection algorithms

</td>
</tr>
<tr>
<td width="50%">

### Recon Analyzer
- WHOIS lookups
- DNS enumeration
- GeoIP resolution
- Subdomain discovery

</td>
<td width="50%">

### URL Analyzer
- Redirect chain analysis
- Phishing detection
- SSL/TLS verification
- AI-powered risk assessment

</td>
</tr>
<tr>
<td colspan="2">

### Web Analyzer
- Security header analysis
- Technology stack detection
- Port scanning
- WAF/Firewall detection
- Certificate validation

</td>
</tr>
</table>

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         IntelX Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Frontend   │  │   Frontend   │  │   Frontend   │           │
│  │   (React)    │  │   (Mobile)   │  │    (CLI)     │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────┐    │
│  │                    API Gateway                           │    │
│  │              (Nginx Reverse Proxy)                       │    │
│  └──────────────────────────────────────────────────────────┘    │
│         │          │          │          │          │            │
│  ┌──────▼───┐ ┌────▼────┐ ┌───▼───┐ ┌────▼────┐ ┌───▼────┐      │
│  │ Malware  │ │  Steg   │ │ Recon │ │   URL   │ │  Web   │      │
│  │ Analyzer │ │ Analyzer│ │Analyzer│ │ Analyzer│ │Analyzer│      │
│  │  :5001   │ │  :5002  │ │ :5003 │ │  :5004  │ │ :5005  │      │
│  └──────────┘ └─────────┘ └───────┘ └─────────┘ └────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Shared Infrastructure                  │   │
│  │         PostgreSQL  ·  Redis  ·  Background Workers       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Docker | 20.10+ |
| Docker Compose | 2.0+ |
| Git | 2.30+ |

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/intelx.git
cd intelx

# Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Start all services
cd backend
docker compose up -d --build
```

### Verify Installation

```bash
# Check running containers
docker compose ps

# Test health endpoints
curl http://localhost:5001/api/malware-analyzer/health
curl http://localhost:5004/api/url-analyzer/health
```

## API Reference

### Service Endpoints

| Service | Base URL | Health Check |
|---------|----------|--------------|
| Malware Analyzer | `http://localhost:5001/api/malware-analyzer` | `/health` |
| Steg Analyzer | `http://localhost:5002/api/steg-analyzer` | `/health` |
| Recon Analyzer | `http://localhost:5003/api/recon-analyzer` | `/health` |
| URL Analyzer | `http://localhost:5004/api/url-analyzer` | `/health` |
| Web Analyzer | `http://localhost:5005/api/web-analyzer` | `/health` |

### Example: URL Analysis

```bash
curl -X POST http://localhost:5004/api/url-analyzer/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Response:**
```json
{
  "original_url": "https://example.com",
  "total_hops": 1,
  "final_destination": {
    "url": "https://example.com",
    "domain": "example.com",
    "uses_https": true
  },
  "risk_assessment": {
    "level": "low",
    "score": 100,
    "reasons": ["Safe redirect chain"]
  },
  "is_safe": true
}
```

### Example: Malware Analysis

```bash
curl -X POST http://localhost:5001/api/malware-analyzer/decompile \
  -F "file=@suspicious_binary.exe"
```

## Project Structure

```
intelx/
├── backend/
│   ├── docker-compose.yml      # Unified orchestration
│   ├── .env                    # Environment configuration
│   ├── Malware-Analyzer/       # Binary analysis service
│   ├── Steg-Analyzer/          # Steganography detection
│   ├── Recon-Analyzer/         # Domain reconnaissance
│   ├── Url-Analyzer/           # URL safety analysis
│   └── Web-Analyzer/           # Web vulnerability scanning
├── frontend/                   # Web interface (React)
└── README.md
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VIRUSTOTAL_API_KEY` | VirusTotal API key for malware scanning | Yes |
| `GEMINI_API_KEY` | Google Gemini API for AI analysis | Optional |
| `SHODAN_API_KEY` | Shodan API for reconnaissance | Optional |
| `POSTGRES_PASSWORD` | PostgreSQL database password | Yes |

### Port Configuration

All services run internally on port `5000` and are mapped to external ports:

| Internal | External | Service |
|----------|----------|---------|
| 5000 | 5001 | Malware Analyzer |
| 5000 | 5002 | Steg Analyzer |
| 5000 | 5003 | Recon Analyzer |
| 5000 | 5004 | URL Analyzer |
| 5000 | 5005 | Web Analyzer |

## Development

### Running Individual Services

```bash
# Start specific service
docker compose up -d url-analyzer

# View logs
docker compose logs -f url-analyzer

# Restart service
docker compose restart url-analyzer
```

### Rebuilding After Changes

```bash
docker compose up -d --build <service-name>
```

## Documentation

Detailed API documentation is available in each service directory:

- [Malware Analyzer Docs](backend/Malware-Analyzer/README.md)
- [Steg Analyzer Docs](backend/Steg-Analyzer/README.md)
- [Recon Analyzer Docs](backend/Recon-Analyzer/README.md)
- [URL Analyzer Docs](backend/Url-Analyzer/README.md)
- [Web Analyzer Docs](backend/Web-Analyzer/README.md)

## Tech Stack

<p align="left">
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
<img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white" alt="Nginx" />
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
</p>

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-analyzer`)
3. Commit changes (`git commit -m 'Add new analyzer'`)
4. Push to branch (`git push origin feature/new-analyzer`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for Security Professionals**

[Report Bug](https://github.com/your-username/intelx/issues) · [Request Feature](https://github.com/your-username/intelx/issues)

</div>