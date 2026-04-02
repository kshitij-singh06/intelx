
import { Loader2, WifiOff } from 'lucide-react'
import { useApiStatus } from '../../hooks/useApiStatus'

export default function ApiStatusBadge({ serviceId }) {
    const { statuses } = useApiStatus(30_000)
    const status = statuses[serviceId] ?? 'checking'

    if (status === 'checking') {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                <Loader2 size={11} className="animate-spin" />
                <span className="text-xs font-mono">CHECKING</span>
            </div>
        )
    }

    if (status === 'online') {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono">API ONLINE</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <WifiOff size={11} />
            <span className="text-xs font-mono">API OFFLINE</span>
        </div>
    )
}
