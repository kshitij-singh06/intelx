import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/web-analyzer': {
        // Toggle :
        // target: 'http://localhost:5001',
        target: 'https://web-analyzer-production-692b.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/steg-analyzer': {
        // Toggle :
        // target: 'http://localhost:5002',
        target: 'https://steg-production-8648.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/Recon-Analyzer': {
        // Toggle :
        // target: 'http://localhost:5003',
        target: 'https://recon-production-f0ae.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/Recon-Analyzer/, '/api/Recon-Analyzer')
      },
      '/api/url-analyzer': {
        // Toggle :
        // target: 'http://localhost:5004',
        target: 'https://url-production-4a13.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/malware-analyzer': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Health-check-only routes
      '/health/url-analyzer': {
        // Toggle :
        // target: 'http://localhost:5004',
        target: 'https://url-production-4a13.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: () => '/health',
      },
    }
  }
})
