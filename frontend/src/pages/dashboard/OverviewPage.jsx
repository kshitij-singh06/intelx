import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Bug, Radar, ArrowRight, Eye, Link2, Search, X, ChevronRight, Zap, RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiStatus, SERVICES } from '../../hooks/useApiStatus'

// ─── Tool definitions ───────────────────────────────────────────────────────
const TOOLS = [
    {
        id: 'web',
        label: 'Web Analysis',
        description: 'Scan for vulnerabilities, headers, DNS.',
        icon: Globe,
        path: '/dashboard/web',
        color: 'neon-green',
        placeholder: 'e.g. example.com or 192.168.1.1',
        hint: 'Domain / IP',
        detect: (q) => /^(\d{1,3}\.){3}\d{1,3}$/.test(q) || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(q),
    },
    {
        id: 'malware',
        label: 'Malware Analysis',
        description: 'Static and dynamic file analysis.',
        icon: Bug,
        path: '/dashboard/malware',
        color: 'red-400',
        placeholder: 'e.g. MD5 / SHA256 hash',
        hint: 'Hash / File',
        detect: (q) => /^[a-f0-9]{32}$/i.test(q) || /^[a-f0-9]{64}$/i.test(q),
    },
    {
        id: 'recon',
        label: 'Recon Analysis',
        description: 'OSINT for users and exposed data.',
        icon: Radar,
        path: '/dashboard/recon',
        color: 'neon-yellow',
        placeholder: 'e.g. username, email or phone',
        hint: 'Username / Email',
        detect: (q) => q.includes('@') || (q.length > 2 && !q.includes('.')),
    },
    {
        id: 'steg',
        label: 'Steg Analysis',
        description: 'Detect hidden data in files.',
        icon: Eye,
        path: '/dashboard/steg',
        color: 'purple-400',
        placeholder: 'Upload an image file on the Steg page',
        hint: 'Image File',
        detect: () => false,
    },
    {
        id: 'url',
        label: 'URL Analyzer',
        description: 'Trace redirects & assess safety.',
        icon: Link2,
        path: '/dashboard/url',
        color: 'blue-400',
        placeholder: 'e.g. https://bit.ly/short-url',
        hint: 'URL / Short link',
        detect: (q) => /^https?:\/\//i.test(q),
    },
]

// ─── Auto-detect tool from query ────────────────────────────────────────────
function detectTool(query) {
    if (!query.trim()) return null
    return TOOLS.find((t) => t.detect(query)) ?? null
}

// ─── Quick Action Card ───────────────────────────────────────────────────────
const QuickActionCard = ({ title, description, icon: Icon, to, color }) => (
    <Link to={to} className="block group">
        <motion.div
            whileHover={{ y: -4 }}
            className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity text-${color}`}>
                <ArrowRight size={24} />
            </div>
            <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} mb-4`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-foreground/60">{description}</p>
        </motion.div>
    </Link>
)

// ─── API Status Badge ────────────────────────────────────────────────────────
function ApiStatusPanel() {
    const { statuses, lastChecked, refetch } = useApiStatus(30_000)
    const [expanded, setExpanded] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const onlineCount = Object.values(statuses).filter((s) => s === 'online').length
    const totalCount = SERVICES.length
    const allOnline = onlineCount === totalCount
    const anyChecking = Object.values(statuses).some((s) => s === 'checking')

    const handleRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setTimeout(() => setRefreshing(false), 600)
    }

    const statusColor = anyChecking ? 'yellow-400'
        : allOnline ? 'green-500'
        : onlineCount === 0 ? 'red-500'
        : 'orange-400'

    const statusText = anyChecking ? 'CHECKING'
        : allOnline ? 'ALL ONLINE'
        : `${onlineCount}/${totalCount} ONLINE`

    const serviceIcon = { web: Globe, malware: Bug, steg: Eye, recon: Radar, url: Link2 }

    return (
        <div className="relative">
            <button
                onClick={() => setExpanded(!expanded)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    anyChecking
                        ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                        : allOnline
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : onlineCount === 0
                        ? 'bg-red-500/10 border-red-500/20 text-red-500'
                        : 'bg-orange-400/10 border-orange-400/20 text-orange-400'
                }`}
            >
                {anyChecking ? (
                    <Loader2 size={11} className="animate-spin" />
                ) : allOnline ? (
                    <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
                ) : (
                    <div className={`w-2 h-2 rounded-full bg-${statusColor}`} />
                )}
                <span className="text-xs font-mono">{statusText}</span>
                <ChevronRight
                    size={12}
                    className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                />
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full mt-2 z-50 w-60 bg-[#0a0e17]/98 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">Service Status</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRefresh() }}
                                className="text-foreground/40 hover:text-neon-green transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {/* Services */}
                        <div className="p-2">
                            {SERVICES.map((service) => {
                                const status = statuses[service.id]
                                const Icon = serviceIcon[service.id] ?? Wifi
                                return (
                                    <div
                                        key={service.id}
                                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon size={13} className="text-foreground/40" />
                                            <span className="text-xs font-mono text-foreground/70">{service.label}</span>
                                        </div>
                                        <StatusBadge status={status} />
                                    </div>
                                )
                            })}
                        </div>

                        {/* Footer */}
                        {lastChecked && (
                            <div className="px-4 py-2 border-t border-white/5">
                                <p className="text-[10px] font-mono text-foreground/25">
                                    Last checked {lastChecked.toLocaleTimeString()}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function StatusBadge({ status }) {
    if (status === 'checking') {
        return (
            <span className="flex items-center gap-1 text-[10px] font-mono text-yellow-400">
                <Loader2 size={10} className="animate-spin" />
                checking
            </span>
        )
    }
    if (status === 'online') {
        return (
            <span className="flex items-center gap-1 text-[10px] font-mono text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                online
            </span>
        )
    }
    return (
        <span className="flex items-center gap-1 text-[10px] font-mono text-red-400">
            <WifiOff size={10} />
            offline
        </span>
    )
}

export default function OverviewPage() {
    const navigate = useNavigate()
    const inputRef = useRef(null)

    const [query, setQuery] = useState('')
    const [selectedToolId, setSelectedToolId] = useState(null)
    const [showSuggestion, setShowSuggestion] = useState(false)
    const [error, setError] = useState('')

    const selectedTool = TOOLS.find((t) => t.id === selectedToolId) ?? null
    const autoDetected = detectTool(query)
    const activeTool = selectedTool ?? autoDetected

    // Show auto-detect suggestion bubble
    useEffect(() => {
        if (!selectedToolId && autoDetected) {
            setShowSuggestion(true)
        } else {
            setShowSuggestion(false)
        }
    }, [query, selectedToolId, autoDetected])

    const handleScan = () => {
        setError('')
        if (!activeTool) {
            setError('Please select a tool below, or type a domain, URL, hash, or username to auto-detect.')
            inputRef.current?.focus()
            return
        }
        if (query.trim()) {
            sessionStorage.setItem('intelx_prefill_query', query.trim())
        }
        navigate(activeTool.path)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleScan()
    }

    const currentPlaceholder = activeTool?.placeholder ?? 'Enter domain, URL, hash, username…'

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* ── Welcome Section ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome, <span className="text-neon-green">Analyst</span>
                    </h2>
                    <p className="text-foreground/60">5 intelligence engines ready for deployment.</p>
                </div>
                <ApiStatusPanel />
            </div>

            {/* ── Search Bar ── */}
            <div className="space-y-3">
                <div className="relative">
                    {/* Left icon — shows active tool icon or generic search */}
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                        <AnimatePresence mode="wait">
                            {activeTool ? (
                                <motion.span
                                    key={activeTool.id}
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.6, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={`text-${activeTool.color}`}
                                >
                                    <activeTool.icon size={20} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="search"
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.6, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-foreground/40"
                                >
                                    <Search size={20} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setError('') }}
                        onKeyDown={handleKeyDown}
                        placeholder={currentPlaceholder}
                        className={`w-full h-16 pl-12 pr-44 bg-white/[0.03] border rounded-2xl text-lg text-white placeholder:text-foreground/30 focus:bg-white/[0.05] focus:outline-none transition-all font-mono ${
                            error
                                ? 'border-red-500/50 focus:border-red-500/70'
                                : activeTool
                                ? `border-${activeTool.color}/40 focus:border-${activeTool.color}/70`
                                : 'border-white/10 focus:border-neon-green/50'
                        }`}
                    />

                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setSelectedToolId(null); setError('') }}
                            className="absolute inset-y-0 right-36 flex items-center text-foreground/30 hover:text-foreground/70 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {/* Scan button */}
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleScan}
                            className={`h-12 px-5 rounded-xl font-mono font-bold text-sm flex items-center gap-2 transition-all ${
                                activeTool
                                    ? 'bg-neon-green text-background shadow-lg shadow-neon-green/25 hover:bg-neon-green/90'
                                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                            }`}
                        >
                            <Zap size={15} />
                            Scan Target
                        </motion.button>
                    </div>
                </div>

                {/* Auto-detect suggestion pill */}
                <AnimatePresence>
                    {showSuggestion && autoDetected && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 text-xs font-mono text-foreground/50"
                        >
                            <span className="text-neon-green">◈</span>
                            Auto-detected:
                            <button
                                onClick={() => setSelectedToolId(autoDetected.id)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded bg-${autoDetected.color}/10 border border-${autoDetected.color}/30 text-${autoDetected.color} hover:bg-${autoDetected.color}/20 transition-colors`}
                            >
                                <autoDetected.icon size={11} />
                                {autoDetected.label}
                                <ChevronRight size={11} />
                            </button>
                            <span className="text-foreground/30">— click to confirm, or pick a tool below</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-mono text-red-400 flex items-center gap-2"
                        >
                            <X size={12} />
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Tool chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                    {TOOLS.map((tool) => {
                        const isSelected = selectedToolId === tool.id
                        return (
                            <motion.button
                                key={tool.id}
                                onClick={() => setSelectedToolId(isSelected ? null : tool.id)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                                    isSelected
                                        ? `bg-${tool.color}/15 border-${tool.color}/50 text-${tool.color}`
                                        : 'bg-white/[0.03] border-white/10 text-foreground/50 hover:border-white/20 hover:text-foreground/80'
                                }`}
                            >
                                <tool.icon size={12} />
                                {tool.label}
                                {isSelected && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-0.5"
                                    >
                                        <X size={10} />
                                    </motion.span>
                                )}
                            </motion.button>
                        )
                    })}

                    {(selectedToolId || query) && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-mono text-foreground/30 flex items-center px-2"
                        >
                            {activeTool ? `→ ${activeTool.label}` : 'select a tool'}
                        </motion.span>
                    )}
                </div>
            </div>

            {/* ── Quick Actions Grid ── */}
            <div>
                <p className="text-xs font-mono text-foreground/30 uppercase tracking-widest mb-4">Quick Access</p>

                {/* First Row (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <QuickActionCard
                        title="Web Analysis"
                        description="Scan for vulnerabilities, headers, DNS."
                        icon={Globe}
                        to="/dashboard/web"
                        color="neon-green"
                    />
                    <QuickActionCard
                        title="Malware Analysis"
                        description="Static and dynamic file analysis."
                        icon={Bug}
                        to="/dashboard/malware"
                        color="red-400"
                    />
                    <QuickActionCard
                        title="Recon Analysis"
                        description="OSINT for users and exposed data."
                        icon={Radar}
                        to="/dashboard/recon"
                        color="neon-yellow"
                    />
                </div>

                {/* Second Row (2 cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QuickActionCard
                        title="Steg Analysis"
                        description="Detect hidden data in files."
                        icon={Eye}
                        to="/dashboard/steg"
                        color="purple-400"
                    />
                    <QuickActionCard
                        title="URL Analyzer"
                        description="Trace redirects & assess safety."
                        icon={Link2}
                        to="/dashboard/url"
                        color="blue-400"
                    />
                </div>
            </div>
        </div>
    )
}
