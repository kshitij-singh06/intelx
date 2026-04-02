/**
 * useApiStatus — checks all 5 IntelX backend services via the Vite proxy.
 *
 * All URLs are relative (no host/port), exactly like the tool pages, so this
 * works in both dev (Vite proxy) and production (same-origin reverse proxy).
 */
import { useState, useEffect } from 'react'

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
