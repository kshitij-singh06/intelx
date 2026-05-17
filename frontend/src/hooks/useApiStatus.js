/**
 * useApiStatus — checks all 5 IntelX backend services
 * Uses absolute URLs from environment variables in production
 * Uses relative URLs via Vite proxy in development
 */
import { useState, useEffect } from 'react'

// Helper function to get API URL (absolute if env var exists, else relative)
function getApiUrl(path, envVar) {
    // In production (Vercel), environment variable will be set
    const baseUrl = import.meta.env[envVar]
    if (baseUrl) {
        return baseUrl + path
    }
    // In development, use relative URL (Vite proxy will handle it)
    return path
}

export const SERVICES = [
    {
        id: 'web',
        label: 'Web API',
        url: getApiUrl('/api/web-analyzer/', 'VITE_WEB_ANALYZER_URL'),
        ok: (res) => res.ok,
    },
    {
        id: 'malware',
        label: 'Malware API',
        url: getApiUrl('/api/malware-analyzer/health', 'VITE_MALWARE_ANALYZER_URL'),
        ok: (res) => res.ok,
    },
    {
        id: 'steg',
        label: 'Steg API',
        url: getApiUrl('/api/steg-analyzer/', 'VITE_STEG_ANALYZER_URL'),
        ok: (res) => res.ok,
    },
    {
        id: 'recon',
        label: 'Recon API',
        url: getApiUrl('/api/Recon-Analyzer/health', 'VITE_RECON_ANALYZER_URL'),
        ok: (res) => res.ok,
    },
    {
        id: 'url',
        label: 'URL API',
        url: getApiUrl('/api/url-analyzer/', 'VITE_URL_ANALYZER_URL'),
        ok: (res) => res.ok,
    },
]

// --- Global Store ---
// Keeps track of the API status entirely outside of React components.
// This prevents multiple polling intervals and stops status resets when switching tabs!
const globalState = {
    statuses: Object.fromEntries(SERVICES.map((s) => [s.id, 'checking'])),
    lastChecked: null,
}

const listeners = new Set()

function notify() {
    listeners.forEach(l => l())
}

let isPolling = false

async function performCheck(isInitial = false) {
    if (isInitial) {
        SERVICES.forEach(s => globalState.statuses[s.id] = 'checking')
        notify()
    }

    await Promise.allSettled(
        SERVICES.map(async (svc) => {
            try {
                const res = await fetch(svc.url, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5_000),
                    cache: 'no-store',
                })
                globalState.statuses[svc.id] = svc.ok(res) ? 'online' : 'offline'
                notify()
            } catch {
                globalState.statuses[svc.id] = 'offline'
                notify()
            }
        })
    )

    globalState.lastChecked = new Date()
    notify()
}

function startPolling(intervalMs) {
    if (isPolling) return
    isPolling = true
    
    performCheck(true)
    setInterval(() => performCheck(false), intervalMs)
}

/**
 * @typedef {'online'|'offline'|'checking'} ApiStatus
 * @returns {{ statuses: Record<string, ApiStatus>, lastChecked: Date|null, refetch: () => Promise<void> }}
 */
export function useApiStatus(pollIntervalMs = 30_000) {
    const [statuses, setStatuses] = useState(globalState.statuses)
    const [lastChecked, setLastChecked] = useState(globalState.lastChecked)

    useEffect(() => {
        // Start global polling (ignored if already started)
        startPolling(pollIntervalMs)

        // Subscribe local component to global state changes
        const handleUpdate = () => {
            setStatuses({ ...globalState.statuses })
            setLastChecked(globalState.lastChecked)
        }
        
        listeners.add(handleUpdate)
        
        // Just in case it updated between mount and subscribing
        handleUpdate()

        return () => listeners.delete(handleUpdate)
    }, [pollIntervalMs])

    return { statuses, lastChecked, refetch: () => performCheck(true) }
}
