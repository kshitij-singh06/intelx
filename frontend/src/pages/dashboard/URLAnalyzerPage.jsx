import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Link2, ArrowRight, Shield, AlertTriangle, CheckCircle, XCircle,
    Globe, Server, ChevronDown, ChevronUp, Loader2, Clock, ExternalLink,
    ArrowDownRight, Info
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

const API_URL = 'http://localhost:5004/api/url-analyzer/analyze'

// ========== HELPER COMPONENTS ==========

const RiskBadge = ({ level, score }) => {
    const colors = {
        low: 'bg-green-500/10 text-green-400 border-green-500/30',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        high: 'bg-red-500/10 text-red-400 border-red-500/30',
    }
    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono uppercase border ${colors[level] || colors.medium}`}>
            <span>{level} Risk</span>
            {score !== undefined && <span className="opacity-60">({score})</span>}
        </div>
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

const HopCard = ({ hop, isLast }) => {
    const statusColor = hop.status_code >= 200 && hop.status_code < 300
        ? 'green'
        : hop.status_code >= 300 && hop.status_code < 400
            ? 'yellow'
            : 'red'

    return (
        <div className="relative">
            {/* Connector Line */}
            {!isLast && (
                <div className="absolute left-6 top-full w-0.5 h-6 bg-gradient-to-b from-white/20 to-transparent" />
            )}

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${statusColor}-500/10 border border-${statusColor}-500/30 flex items-center justify-center text-${statusColor}-400 font-bold font-mono text-sm`}>
                            {hop.hop}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-mono text-sm">{hop.domain}</span>
                                {hop.is_https && (
                                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-mono">HTTPS</span>
                                )}
                            </div>
                            <div className="text-xs text-foreground/40 font-mono">{hop.resolved_ip}</div>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded bg-${statusColor}-500/10 text-${statusColor}-400 text-xs font-mono border border-${statusColor}-500/20`}>
                        {hop.status_code}
                    </div>
                </div>

                {/* Types */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {hop.types?.map((type, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-foreground/70 font-mono">
                            {type}
                        </span>
                    ))}
                </div>

                {/* Notes */}
                {hop.notes && hop.notes.length > 0 && (
                    <div className="text-xs text-foreground/50 italic">
                        {hop.notes.join(' • ')}
                    </div>
                )}

                {/* Redirect Target */}
                {hop.redirects_to && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-foreground/60">
                        <ArrowDownRight size={14} className="text-neon-green" />
                        <span className="font-mono truncate">{hop.redirects_to}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// ========== MAIN COMPONENT ==========

export default function URLAnalyzerPage() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [results, setResults] = useState(null)

    const handleAnalyze = async () => {
        if (!url.trim()) return
        setLoading(true)
        setError(null)
        setResults(null)

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url.trim() })
            })
            if (!res.ok) throw new Error('Analysis failed')
            const data = await res.json()
            setResults(data)
        } catch (e) {
            setError(e.message || 'Failed to analyze URL')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <Link2 size={28} className="text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">URL Analyzer</h1>
                    <p className="text-foreground/60 text-sm">Trace redirects & assess link safety</p>
                </div>
            </div>

            {/* Input Panel */}
            <div className="p-6 rounded-2xl bg-[#0a0e17] border border-white/10">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            disabled={loading}
                            placeholder="Enter URL to analyze (e.g., https://shorturl.at/abc123)"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-foreground/40 font-mono focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={loading || !url.trim()}
                        variant="primary"
                        className="px-6 py-3 font-mono bg-blue-500 hover:bg-blue-600"
                    >
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin mr-2" /> Analyzing...</>
                        ) : (
                            <><Link2 size={18} className="mr-2" /> Analyze URL</>
                        )}
                    </Button>
                </div>
            </div>

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
                        <Link2 size={48} className="text-blue-400" />
                    </motion.div>
                    <p className="text-foreground/60 font-mono">Following redirect chain...</p>
                </div>
            )}

            {/* Results */}
            {results && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* Summary Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a0e17] to-[#0d1225] border border-white/10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-foreground/60 text-sm mb-1">Original URL</p>
                                    <p className="text-white font-mono text-lg break-all">{results.original_url}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ArrowRight size={16} className="text-neon-green" />
                                    <p className="text-foreground/60 text-sm">Final Destination</p>
                                </div>
                                <a
                                    href={results.final_destination?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-neon-green font-mono hover:underline"
                                >
                                    {results.final_destination?.url}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <RiskBadge level={results.risk_assessment?.level} score={results.risk_assessment?.score} />
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${results.is_safe
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                    }`}>
                                    {results.is_safe ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    {results.is_safe ? 'SAFE' : 'POTENTIALLY UNSAFE'}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-foreground/40">
                                    <Clock size={14} />
                                    {results.analysis_time_ms}ms
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/10 text-center">
                            <p className="text-3xl font-bold text-white font-mono">{results.total_hops}</p>
                            <p className="text-xs text-foreground/60 uppercase">Total Hops</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/10 text-center">
                            <p className="text-3xl font-bold text-white font-mono">{results.final_destination?.status_code}</p>
                            <p className="text-xs text-foreground/60 uppercase">Final Status</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/10 text-center">
                            <p className={`text-3xl font-bold font-mono ${results.final_destination?.uses_https ? 'text-green-400' : 'text-red-400'}`}>
                                {results.final_destination?.uses_https ? 'Yes' : 'No'}
                            </p>
                            <p className="text-xs text-foreground/60 uppercase">HTTPS</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0a0e17] border border-white/10 text-center">
                            <p className="text-3xl font-bold text-white font-mono">{results.final_destination?.ip?.split('.').slice(0, 2).join('.')}.x.x</p>
                            <p className="text-xs text-foreground/60 uppercase">Destination IP</p>
                        </div>
                    </div>

                    {/* Risk Reasons */}
                    {results.risk_assessment?.reasons && results.risk_assessment.reasons.length > 0 && (
                        <ResultCard title="Risk Factors" icon={AlertTriangle} color="yellow-500">
                            <ul className="space-y-2">
                                {results.risk_assessment.reasons.map((reason, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                                        <XCircle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>
                    )}

                    {/* Redirect Chain */}
                    <ResultCard title={`Redirect Chain (${results.redirect_chain?.length || 0} hops)`} icon={ArrowRight} color="blue-400">
                        <div className="space-y-6">
                            {results.redirect_chain?.map((hop, i) => (
                                <HopCard key={i} hop={hop} isLast={i === results.redirect_chain.length - 1} />
                            ))}
                        </div>
                    </ResultCard>

                    {/* Limitations */}
                    {results.limitations && results.limitations.length > 0 && (
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
                                <div className="text-sm text-blue-300/80">
                                    <strong>Analysis Limitations:</strong>
                                    <ul className="list-disc pl-4 mt-1 space-y-1 text-blue-300/60">
                                        {results.limitations.map((lim, i) => <li key={i}>{lim}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}
