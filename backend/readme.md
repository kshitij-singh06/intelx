# IntelX Backend

**IntelX** is a comprehensive security analysis platform comprising five specialized microservices. This repository hosts the unified backend infrastructure, allowing you to orchestrate and run all analyzers simultaneously.

## 🏗️ Architecture

The backend consists of **5 independent microservices**, each running in its own Docker container and exposing a specific API on a dedicated port.

| Service | Port | Description |
| :--- | :--- | :--- |
| **Malware Analyzer** | `5001` | Analyzes binary files using YARA, Ghidra (decompilation), and VirusTotal. |
| **Steg Analyzer** | `5002` | Detects steganography in images using generic and deep analysis tools (binwalk, steghide, etc.). |
| **Recon Analyzer** | `5003` | Performs domain and IP reconnaissance (Whois, DNS, GeoIP, Shodan). |
| **URL Analyzer** | `5004` | scans URLs for phishing and malicious content (headless browser analysis, blocklists). |
| **Web Analyzer** | `5005` | Analyzes web technologies, headers, and specific CMS vulnerabilities. |

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- **Git** to clone the repository.

### 1. Installation

Clone the repository:

```bash
git clone https://github.com/your-repo/intelx.git
cd intelx/backend
```

### 2. Configuration

Create a `.env` file in the root `backend` directory. You can copy the example:

```bash
cp .env.example .env
```

Ensure you populate the necessary API keys in `.env` (e.g., `VIRUSTOTAL_API_KEY`, `SHODAN_API_KEY`) for full functionality.

### 3. Run All Services

You can start the entire stack (all 5 analyzers plus databases and Redis/workers) with a **single command**:

```bash
docker compose up -d --build
```

This command will:
1.  Build all Docker images for the analyzers.
2.  Start the **PostgreSQL** and **Redis** infrastructure.
3.  Launch all API services and background workers.

### 4. Verification

Check if all containers are running:

```bash
docker compose ps
```

You should see services running on ports `5001` through `5005`.

## 📡 API Endpoints

Once running, the analyzers are accessible at:

- **Malware Analyzer**: `http://localhost:5001/api/malware-analyzer/`
- **Steg Analyzer**: `http://localhost:5002/api/steg-analyzer/`
- **Recon Analyzer**: `http://localhost:5003/api/recon-analyzer/`
- **URL Analyzer**: `http://localhost:5004/api/url-analyzer/`
- **Web Analyzer**: `http://localhost:5005/api/web-analyzer/`

Refer to the specific `README.md` within each analyzer's directory for detailed API documentation and payload examples.

## 🛠️ Development

To view logs for a specific service (e.g., Steg Analyzer):

```bash
docker compose logs -f steg-analyzer
```

To restart a specific service:

```bash
docker compose restart web-analyzer
```

## 📝 License

[MIT](LICENSE)