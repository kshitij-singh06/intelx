import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Radar, Search, Globe, Shield, MapPin, Server, Users, Mail, Phone,
    AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2,
    Eye, EyeOff, Activity, Wifi, Lock, Unlock, ExternalLink
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

const API_BASE = 'http://localhost:5003/api/Recon-Analyzer'

// ========== HELPER COMPONENTS ==========

const InfoRow = ({ label, value, icon: Icon, color = 'white' }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <span className="text-foreground/60 text-sm flex items-center gap-2">
            {Icon && <Icon size={14} className="text-foreground/40" />}
            {label}
        </span>
        <span className={`text-${color} text-sm font-mono`}>{value || 'N/A'}</span>
    </div>
)

const RiskBadge = ({ level }) => {
    const colors = {
        low: 'bg-green-500/10 text-green-400 border-green-500/30',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        high: 'bg-red-500/10 text-red-400 border-red-500/30',
    }
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase border ${colors[level] || colors.low}`}>
            {level} Risk
        </span>
    )
}

const ResultCard = ({ title, icon: Icon, children, color = 'neon-green', collapsed = false }) => {
    const [isOpen, setIsOpen] = useState(!collapsed)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-[#0a0e17] border border-white/10 overflow-hidden"
        >
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${color}/10`}>
                        <Icon size={18} className={`text-${color}`} />
                    </div>
                    <h3 className="font-bold text-white">{title}</h3>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-foreground/40" /> : <ChevronDown size={18} className="text-foreground/40" />}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ========== MAIN COMPONENT ==========

export default function ReconGraphPage() {
    const [mode, setMode] = useState('threat') // 'threat' or 'footprint'
    const [query, setQuery] = useState('')
    const [footprintType, setFootprintType] = useState('username')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [results, setResults] = useState(null)
    const [healthStatus, setHealthStatus] = useState(null)

    // Health check on mount
    useEffect(() => {
        fetch(`${API_BASE}/health`)
            .then(res => res.json())
            .then(data => setHealthStatus(data.status))
            .catch(() => setHealthStatus('unhealthy'))
    }, [])

    const handleThreatScan = async () => {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        setResults(null)

        try {
            const res = await fetch(`${API_BASE}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query.trim() })
            })
            if (!res.ok) throw new Error('Scan failed')
            const data = await res.json()
            setResults({ type: 'threat', data })
        } catch (e) {
            setError(e.message || 'Failed to perform threat scan')
        } finally {
            setLoading(false)
        }
    }

    const handleFootprintScan = async () => {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        setResults(null)

        try {
            const res = await fetch(`${API_BASE}/footprint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query.trim(), type: footprintType })
            })
            if (!res.ok) throw new Error('Footprint analysis failed')
            const data = await res.json()
            setResults({ type: 'footprint', subtype: footprintType, data })
        } catch (e) {
            setError(e.message || 'Failed to analyze footprint')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = () => {
        if (mode === 'threat') handleThreatScan()
        else handleFootprintScan()
    }

    const calculateRisk = (data) => {
        if (!data) return 'low'
        if (data.talos?.blacklisted || data.tor?.is_tor_exit) return 'high'
        return 'low'
    }

    const getFootprintRisk = (data) => {
        if (!data) return 'low'
        if (data.username_scan?.count > 10) return 'high'
        if (data.username_scan?.count > 5) return 'medium'
        return 'low'
    }

    return (
        <div className="min-h-screen p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30">
                        <Radar size={28} className="text-neon-yellow" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Recon Analysis</h1>
                        <p className="text-foreground/60 text-sm">OSINT & Threat Intelligence</p>
                    </div>
                </div>
                {healthStatus && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${healthStatus === 'healthy'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${healthStatus === 'healthy' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                        {healthStatus === 'healthy' ? 'System Online' : 'System Offline'}
                    </div>
                )}
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-[#0a0e17] rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => { setMode('threat'); setResults(null); setQuery(''); }}
                    className={`px-5 py-2.5 rounded-lg font-mono text-sm transition-all ${mode === 'threat'
                            ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30'
                            : 'text-foreground/60 hover:text-white'
                        }`}
                >
                    <Globe size={16} className="inline mr-2" />
                    Threat Intel
                </button>
                <button
                    onClick={() => { setMode('footprint'); setResults(null); setQuery(''); }}
                    className={`px-5 py-2.5 rounded-lg font-mono text-sm transition-all ${mode === 'footprint'
                            ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30'
                            : 'text-foreground/60 hover:text-white'
                        }`}
                >
                    <Users size={16} className="inline mr-2" />
                    Footprint
                </button>
            </div>

            {/* Input Panel */}
            <motion.div
                layout
                className="p-6 rounded-2xl bg-[#0a0e17] border border-white/10"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {mode === 'footprint' && (
                        <select
                            value={footprintType}
                            onChange={(e) => setFootprintType(e.target.value)}
                            disabled={loading}
                            className="px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-neon-yellow/50 disabled:opacity-50"
                        >
                            <option value="username">Username</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                        </select>
                    )}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            disabled={loading}
                            placeholder={mode === 'threat' ? 'Enter IP address or domain...' : `Enter ${footprintType}...`}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-foreground/40 font-mono focus:outline-none focus:border-neon-yellow/50 disabled:opacity-50"
                        />
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !query.trim()}
                        variant="primary"
                        className="px-6 py-3 font-mono"
                    >
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin mr-2" /> Scanning...</>
                        ) : mode === 'threat' ? (
                            <><Shield size={18} className="mr-2" /> Run Threat Scan</>
                        ) : (
                            <><Eye size={18} className="mr-2" /> Analyze Footprint</>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3"
                >
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Radar size={48} className="text-neon-yellow" />
                    </motion.div>
                    <p className="text-foreground/60 font-mono">Gathering intelligence...</p>
                </div>
            )}

            {/* Results - Threat Intelligence */}
            {results?.type === 'threat' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Summary Card */}
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="text-foreground/60 text-sm mb-1">Target</p>
                                <h2 className="text-2xl font-bold text-white font-mono">{results.data.query}</h2>
                            </div>
                            <RiskBadge level={calculateRisk(results.data)} />
                        </div>
                    </div>

                    {/* IP Intelligence */}
                    {results.data.ipapi && (
                        <ResultCard title="IP Intelligence" icon={MapPin} color="neon-green">
                            <div className="space-y-1">
                                <InfoRow label="IP Address" value={results.data.ipapi.ip} icon={Server} />
                                <InfoRow label="City" value={results.data.ipapi.city} icon={MapPin} />
                                <InfoRow label="Region" value={results.data.ipapi.region} />
                                <InfoRow label="Country" value={results.data.ipapi.country_name} />
                                <InfoRow label="ISP" value={results.data.ipapi.org} icon={Wifi} />
                                <InfoRow label="ASN" value={results.data.ipapi.asn} />
                                <InfoRow label="Timezone" value={results.data.ipapi.timezone} />
                            </div>
                        </ResultCard>
                    )}

                    {/* Reputation */}
                    <ResultCard title="Reputation Check" icon={Shield} color={results.data.talos?.blacklisted ? 'red-500' : 'neon-green'}>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl text-center ${results.data.talos?.blacklisted
                                    ? 'bg-red-500/10 border border-red-500/30'
                                    : 'bg-green-500/10 border border-green-500/30'
                                }`}>
                                {results.data.talos?.blacklisted ? (
                                    <div className="flex items-center justify-center gap-2 text-red-400">
                                        <XCircle size={24} />
                                        <span className="font-bold">BLACKLISTED</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-green-400">
                                        <CheckCircle size={24} />
                                        <span className="font-bold">CLEAN</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-foreground/60 text-sm text-center">
                                Checked against Cisco Talos threat intelligence database
                            </p>
                        </div>
                    </ResultCard>

                    {/* Anonymity */}
                    <ResultCard title="Anonymity Detection" icon={results.data.tor?.is_tor_exit ? EyeOff : Eye} color={results.data.tor?.is_tor_exit ? 'red-500' : 'neon-green'}>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl text-center ${results.data.tor?.is_tor_exit
                                    ? 'bg-red-500/10 border border-red-500/30'
                                    : 'bg-green-500/10 border border-green-500/30'
                                }`}>
                                {results.data.tor?.is_tor_exit ? (
                                    <div className="flex items-center justify-center gap-2 text-red-400">
                                        <EyeOff size={24} />
                                        <span className="font-bold">TOR EXIT NODE</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-green-400">
                                        <Eye size={24} />
                                        <span className="font-bold">NOT TOR</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-foreground/60 text-sm text-center">
                                Checked if IP is a known TOR exit node
                            </p>
                        </div>
                    </ResultCard>

                    {/* Raw Data */}
                    <ResultCard title="Raw Response" icon={Activity} color="foreground/60" collapsed>
                        <pre className="text-xs text-foreground/70 font-mono bg-black/30 p-4 rounded-lg overflow-auto max-h-[300px] custom-scrollbar">
                            {JSON.stringify(results.data, null, 2)}
                        </pre>
                    </ResultCard>
                </motion.div>
            )}

            {/* Results - Footprint */}
            {results?.type === 'footprint' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Username Results */}
                    {results.subtype === 'username' && results.data.username_scan && (
                        <>
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Username</p>
                                        <h2 className="text-2xl font-bold text-white font-mono">@{results.data.username_scan.query || query}</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-neon-yellow">{results.data.username_scan.count}</p>
                                            <p className="text-foreground/60 text-xs">Platforms Found</p>
                                        </div>
                                        <RiskBadge level={getFootprintRisk(results.data)} />
                                    </div>
                                </div>
                            </div>

                            <ResultCard title="Platform Presence" icon={Users} color="neon-yellow">
                                <div className="flex flex-wrap gap-2">
                                    {results.data.username_scan.found?.map((platform, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg text-neon-yellow text-xs font-mono">
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </ResultCard>
                        </>
                    )}

                    {/* Phone Results */}
                    {results.subtype === 'phone' && results.data.phone_scan && (
                        <>
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Phone Number</p>
                                        <h2 className="text-2xl font-bold text-white font-mono">{query}</h2>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-sm font-mono ${results.data.phone_scan.valid
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                        }`}>
                                        {results.data.phone_scan.valid ? 'VALID' : 'INVALID'}
                                    </div>
                                </div>
                            </div>

                            <ResultCard title="Phone Metadata" icon={Phone} color="neon-green">
                                <div className="space-y-1">
                                    <InfoRow label="Country" value={results.data.phone_scan.country} />
                                    <InfoRow label="Carrier" value={results.data.phone_scan.carrier} />
                                    <InfoRow label="Line Type" value={results.data.phone_scan.line_type} />
                                </div>
                            </ResultCard>
                        </>
                    )}

                    {/* Email Results */}
                    {results.subtype === 'email' && results.data.email_scan && (
                        <>
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Email Address</p>
                                        <h2 className="text-2xl font-bold text-white font-mono">{query}</h2>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-sm font-mono ${results.data.email_scan.deliverable
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                        {results.data.email_scan.deliverable ? 'DELIVERABLE' : 'RISKY'}
                                    </div>
                                </div>
                            </div>

                            <ResultCard title="Email Analysis" icon={Mail} color="neon-green">
                                <div className="space-y-1">
                                    <InfoRow label="Domain" value={results.data.email_scan.domain} />
                                    <InfoRow label="Disposable" value={results.data.email_scan.disposable ? 'Yes' : 'No'} />
                                    <InfoRow label="Free Provider" value={results.data.email_scan.free ? 'Yes' : 'No'} />
                                </div>
                            </ResultCard>
                        </>
                    )}

                    {/* Raw Data */}
                    <ResultCard title="Raw Response" icon={Activity} color="foreground/60" collapsed>
                        <pre className="text-xs text-foreground/70 font-mono bg-black/30 p-4 rounded-lg overflow-auto max-h-[300px] custom-scrollbar">
                            {JSON.stringify(results.data, null, 2)}
                        </pre>
                    </ResultCard>
                </motion.div>
            )}
        </div>
    )
}
