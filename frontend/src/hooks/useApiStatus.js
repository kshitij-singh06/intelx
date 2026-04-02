/**
 * useApiStatus — checks all 5 IntelX backend services via the Vite proxy.
 *
 * All URLs are relative (no host/port), exactly like the tool pages, so this
 * works in both dev (Vite proxy) and production (same-origin reverse proxy).
 *
 * Health endpoints:
 *   Web-Analyzer    → GET /api/web-analyzer/          (root returns JSON 200)
 *   Malware-Analyzer→ GET /api/malware-analyzer/health
 *   Steg-Analyzer   → GET /api/steg-analyzer/          (root returns JSON 200)
 *   Recon-Analyzer  → GET /api/Recon-Analyzer/health
 *   URL-Analyzer    → GET /health/url-analyzer          (custom proxy → /health)
 */
import { useState, useEffect, useCallback } from 'react'

export const SERVICES = [
    {
        id: 'web',
        label: 'Web API',
        url: '/api/web-analyzer/',
        ok: (res) => res.ok,
    },
    {
        id: 'malware',
        label: 'Malware API',
        url: '/api/malware-analyzer/health',
        ok: (res) => res.ok,
    },
    {
        id: 'steg',
        label: 'Steg API',
        url: '/api/steg-analyzer/',
        ok: (res) => res.ok,
    },
    {
        id: 'recon',
        label: 'Recon API',
        url: '/api/Recon-Analyzer/health',
        ok: (res) => res.ok,
    },
    {
        id: 'url',
        label: 'URL API',
        url: '/health/url-analyzer',  // proxied by vite to localhost:5004/health
        ok: (res) => res.ok,
    },
]

/**
 * @typedef {'online'|'offline'|'checking'} ApiStatus
 * @returns {{ statuses: Record<string, ApiStatus>, lastChecked: Date|null, refetch: () => Promise<void> }}
 */
export function useApiStatus(pollIntervalMs = 30_000) {
    const initial = () =>
        Object.fromEntries(SERVICES.map((s) => [s.id, 'checking']))

    const [statuses, setStatuses] = useState(initial)
    const [lastChecked, setLastChecked] = useState(null)

    const check = useCallback(async (isInitial = false) => {
        // Only mark as checking on the very first load or manual refetch
        if (isInitial) {
            setStatuses(initial())
        }

        await Promise.allSettled(
            SERVICES.map(async (svc) => {
                try {
                    const res = await fetch(svc.url, {
                        method: 'GET',
                        signal: AbortSignal.timeout(5_000),
                        cache: 'no-store',
                    })
                    const status = svc.ok(res) ? 'online' : 'offline'
                    setStatuses((prev) => ({ ...prev, [svc.id]: status }))
                } catch {
                    setStatuses((prev) => ({ ...prev, [svc.id]: 'offline' }))
                }
            })
        )

        setLastChecked(new Date())
    }, [])

    useEffect(() => {
        check(true)
        const timer = setInterval(() => check(false), pollIntervalMs)
        return () => clearInterval(timer)
    }, [check, pollIntervalMs])

    return { statuses, lastChecked, refetch: check }
}
