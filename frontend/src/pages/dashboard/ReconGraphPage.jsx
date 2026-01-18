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
                    {results.data.ipapi?.ip_info?.[0] && (
                        <ResultCard title="IP Intelligence" icon={MapPin} color="neon-green">
                            <div className="space-y-1">
                                <InfoRow label="ISP" value={results.data.ipapi.ip_info[0].isp} icon={Wifi} />
                                <InfoRow label="Organization" value={results.data.ipapi.ip_info[0].org} icon={Server} />
                                <InfoRow label="AS" value={results.data.ipapi.ip_info[0].as} />
                                <InfoRow label="Location" value={`${results.data.ipapi.ip_info[0].city}, ${results.data.ipapi.ip_info[0].country}`} icon={MapPin} />
                                <InfoRow label="Timezone" value={results.data.ipapi.ip_info[0].timezone} />
                                <InfoRow label="Zip" value={results.data.ipapi.ip_info[0].zip} />
                            </div>
                        </ResultCard>
                    )}

                    {/* Reputation & Threat Signals */}
                    <ResultCard title="Threat Signals" icon={Shield} color={calculateRisk(results.data) === 'high' ? 'red-500' : 'neon-green'}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Talos */}
                                <div className={`p-3 rounded-lg text-center ${results.data.talos?.blacklisted
                                    ? 'bg-red-500/10 border border-red-500/30'
                                    : 'bg-green-500/10 border border-green-500/30'
                                    }`}>
                                    <div className="text-xs font-mono mb-1 text-foreground/60">Cisco Talos</div>
                                    <div className={`font-bold ${results.data.talos?.blacklisted ? 'text-red-400' : 'text-green-400'}`}>
                                        {results.data.talos?.blacklisted ? 'BLACKLISTED' : 'CLEAN'}
                                    </div>
                                </div>

                                {/* TOR */}
                                <div className={`p-3 rounded-lg text-center ${results.data.tor?.is_tor_exit
                                    ? 'bg-red-500/10 border border-red-500/30'
                                    : 'bg-green-500/10 border border-green-500/30'
                                    }`}>
                                    <div className="text-xs font-mono mb-1 text-foreground/60">TOR Node</div>
                                    <div className={`font-bold ${results.data.tor?.is_tor_exit ? 'text-red-400' : 'text-green-400'}`}>
                                        {results.data.tor?.is_tor_exit ? 'EXIT NODE' : 'FALSE'}
                                    </div>
                                </div>
                            </div>

                            {/* ThreatFox */}
                            {results.data.threatfox && (
                                <div className="pt-2 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-foreground/60 text-sm">ThreatFox Analysis</span>
                                        {results.data.threatfox.found ? (
                                            <span className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">DETECTED</span>
                                        ) : (
                                            <span className="text-xs font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">CLEAN</span>
                                        )}
                                    </div>

                                    {results.data.threatfox.found && (
                                        <div className="space-y-2 mt-2 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-foreground/40 block">Type</span>
                                                    <span className="text-white font-mono">{results.data.threatfox.threat_type?.replace('_', ' ').toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-foreground/40 block">Malware</span>
                                                    <span className="text-white font-mono">{results.data.threatfox.malware}</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-foreground/40 block">IOC</span>
                                                    <span className="text-white font-mono break-all">{results.data.threatfox.ioc}</span>
                                                </div>
                                                <div>
                                                    <span className="text-foreground/40 block">Conf. Level</span>
                                                    <span className="text-neon-yellow font-mono">{results.data.threatfox.confidence_level}%</span>
                                                </div>
                                                <div>
                                                    <span className="text-foreground/40 block">ID</span>
                                                    <span className="text-foreground/60 font-mono">#{results.data.threatfox.id}</span>
                                                </div>
                                            </div>
                                            {results.data.threatfox.link && (
                                                <a href={results.data.threatfox.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline mt-1">
                                                    View Report <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {results.data.threatfox.error && (
                                        <div className="text-xs text-foreground/40 mt-1 italic">API Note: {results.data.threatfox.error}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </ResultCard>

                    {/* Tranco Rank */}
                    {results.data.tranco && (
                        <ResultCard title="Web Ranking" icon={Activity} color="neon-yellow">
                            <div className="space-y-2">
                                <div className={`px-4 py-2 rounded-xl border ${results.data.tranco.found
                                    ? 'bg-neon-yellow/10 border-neon-yellow/30'
                                    : 'bg-white/5 border-white/10'
                                    }`}>
                                    <div className="text-xs text-foreground/60 font-mono uppercase mb-1">Tranco Global Rank</div>
                                    <div className={`text-2xl font-bold font-mono ${results.data.tranco.found ? 'text-neon-yellow' : 'text-foreground/40'}`}>
                                        {results.data.tranco.found ? `#${results.data.tranco.rank.toLocaleString()}` : 'Unranked'}
                                    </div>
                                </div>
                                <p className="text-xs text-foreground/50">
                                    Tranco is a research-oriented top 1 million sites ranking.
                                </p>
                            </div>
                        </ResultCard>
                    )}

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
                    {results.subtype === 'username' && (
                        <>
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Username</p>
                                        <h2 className="text-2xl font-bold text-white font-mono">@{results.data.query || query}</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-neon-yellow">
                                                {Array.isArray(results.data.username_scan) ? results.data.username_scan.length : 0}
                                            </p>
                                            <p className="text-foreground/60 text-xs">Platforms Found</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <ResultCard title="Platform Presence" icon={Users} color="neon-yellow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Array.isArray(results.data.username_scan) && results.data.username_scan.map((item, i) => (
                                            <a
                                                key={i}
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-neon-yellow/50 hover:bg-neon-yellow/5 transition-all group"
                                            >
                                                <span className="text-sm font-mono text-white group-hover:text-neon-yellow">{item.site}</span>
                                                <ExternalLink size={14} className="text-foreground/40 group-hover:text-neon-yellow" />
                                            </a>
                                        ))}
                                        {(!results.data.username_scan || results.data.username_scan.length === 0) && (
                                            <div className="text-foreground/40 col-span-full py-4 text-center italic">
                                                No accounts found for this username.
                                            </div>
                                        )}
                                    </div>
                                </ResultCard>
                            </div>
                        </>
                    )}

                    {/* Email Results (Breach Data) */}
                    {results.subtype === 'email' && results.data.email_scan && (
                        <>
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Email Address</p>
                                        <h2 className="text-2xl font-bold text-white font-mono">{results.data.query || query}</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <RiskBadge
                                            level={
                                                results.data.email_scan.risk?.[0]?.risk_label?.toLowerCase() ||
                                                (results.data.email_scan.breach_count > 0 ? 'high' : 'low')
                                            }
                                        />
                                        <div className="text-right pl-4 border-l border-white/10">
                                            <p className={`text-3xl font-bold ${results.data.email_scan.breach_count > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {results.data.email_scan.breach_count || 0}
                                            </p>
                                            <p className="text-foreground/60 text-xs">Breaches Found</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <ResultCard title="Data Breaches" icon={AlertTriangle} color={results.data.email_scan.breach_count > 0 ? 'red-500' : 'green-400'}>
                                    <div className="space-y-4">
                                        {results.data.email_scan.breaches && results.data.email_scan.breaches.map((breach, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-4">
                                                {breach.logo && !breach.logo.includes('[') && (
                                                    <div className="w-16 h-16 shrink-0 bg-white/10 rounded-lg p-2 flex items-center justify-center">
                                                        <img src={breach.logo} alt={breach.breach} className="max-w-full max-h-full" onError={(e) => e.target.style.display = 'none'} />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold text-white text-lg">{breach.breach}</h4>
                                                        <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/20 font-mono">
                                                            {breach.xposed_date}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground/70 mb-3 leading-relaxed">
                                                        {breach.details?.length > 200 ? breach.details.substring(0, 200) + '...' : breach.details}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-xs text-foreground/40 uppercase font-mono mr-2 pt-1">Compromised Data:</span>
                                                        {breach.xposed_data && breach.xposed_data.split(';').map((item, j) => (
                                                            <span key={j} className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-foreground/80">
                                                                {item.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!results.data.email_scan.breaches || results.data.email_scan.breaches.length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                <CheckCircle size={48} className="text-green-500/20 mb-4" />
                                                <h4 className="text-green-400 font-bold mb-1">No Breaches Found</h4>
                                                <p className="text-foreground/50 text-sm">This email address does not appear in known data breaches.</p>
                                            </div>
                                        )}
                                    </div>
                                </ResultCard>
                            </div>
                        </>
                    )}

                    {/* Phone Results (Unchanged for now as no new data provided) */}
                    {results.subtype === 'phone' && results.data.phone_scan && (
                        <>
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-foreground/60 text-sm mb-1">Phone Number</p>
                                        <h2 className="text-2xl font-bold text-white font-mono">{results.data.query || query}</h2>
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
                                    <InfoRow label="Country" value={results.data.phone_scan.country_name} />
                                    <InfoRow label="Country Code" value={results.data.phone_scan.country_code} />
                                    <InfoRow label="Location" value={results.data.phone_scan.location || 'N/A'} />
                                    <InfoRow label="Carrier" value={results.data.phone_scan.carrier || 'N/A'} />
                                    <InfoRow label="Line Type" value={results.data.phone_scan.line_type?.replace(/_/g, ' ').toUpperCase()} />
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
