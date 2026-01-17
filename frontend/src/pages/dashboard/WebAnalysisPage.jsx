import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, Shield, Activity, List, Server, TriangleAlert, CheckCircle, Clock, MapPin, Lock, FileText, Share2, Info, ChevronDown, ChevronUp, AlertCircle, Wifi, Mail, Link2, Cookie, ExternalLink } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const API_BASE = 'http://localhost:5001/api/web-analyzer'

// API endpoint configuration
const API_ENDPOINTS = [
    { key: 'status', endpoint: '/status', name: 'Status Check' },
    { key: 'dns', endpoint: '/dns', name: 'DNS Records' },
    { key: 'headers', endpoint: '/headers', name: 'HTTP Headers' },
    { key: 'techStack', endpoint: '/tech-stack', name: 'Tech Stack' },
    { key: 'whois', endpoint: '/whois', name: 'WHOIS' },
    { key: 'robotsTxt', endpoint: '/robots-txt', name: 'Robots.txt' },
    { key: 'sitemap', endpoint: '/sitemap', name: 'Sitemap' },
    { key: 'cookies', endpoint: '/cookies', name: 'Cookies' },
    { key: 'hsts', endpoint: '/hsts', name: 'HSTS' },
    { key: 'redirects', endpoint: '/redirects', name: 'Redirects' },
    { key: 'ports', endpoint: '/ports', name: 'Port Scan' },
    { key: 'getIp', endpoint: '/get-ip', name: 'IP Lookup' },
    { key: 'socialTags', endpoint: '/social-tags', name: 'Social Tags' },
    { key: 'txtRecords', endpoint: '/txt-records', name: 'TXT Records' },
    { key: 'linkedPages', endpoint: '/linked-pages', name: 'Linked Pages' },
    { key: 'mailConfig', endpoint: '/mail-config', name: 'Mail Config' },
    { key: 'dnssec', endpoint: '/dnssec', name: 'DNSSEC' },
    { key: 'firewall', endpoint: '/firewall', name: 'Firewall' },
    { key: 'dnsServer', endpoint: '/dns-server', name: 'DNS Server' },
    { key: 'carbon', endpoint: '/carbon', name: 'Carbon' },
    { key: 'blockLists', endpoint: '/block-lists', name: 'Block Lists' },
]

const CardHeader = ({ title, icon: Icon, status }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
            {Icon && <Icon size={16} className="text-neon-green" />}
            <h3 className="text-lg font-bold text-neon-green">{title}</h3>
        </div>
        <div className="flex gap-2 text-foreground/40">
            {status === 'loading' && <Activity size={16} className="animate-spin" />}
            {status === 'success' && <CheckCircle size={16} className="text-green-500" />}
            {status === 'error' && <AlertCircle size={16} className="text-red-500" />}
            <Info size={16} className="cursor-pointer hover:text-white" />
            <Share2 size={16} className="cursor-pointer hover:text-white" />
        </div>
    </div>
)

const InfoRow = ({ label, value, flag }) => (
    <div className="flex justify-between items-center py-1 text-sm">
        <span className="text-foreground/70 font-bold">{label}</span>
        <div className="flex items-center gap-2 text-white font-mono text-right max-w-[60%] truncate">
            {value || '-'}
            {flag && <span className="text-lg leading-none">{flag}</span>}
        </div>
    </div>
)

const StatusRow = ({ label, value, status }) => (
    <div className="flex justify-between items-center py-1 text-sm">
        <span className="text-foreground/70 font-bold">{label}</span>
        <div className="flex items-center gap-2">
            {status === 'pass' ? (
                <div className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-bold font-mono">PASS</div>
            ) : status === 'fail' ? (
                <div className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-xs font-bold font-mono">FAIL</div>
            ) : (
                <div className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-xs font-bold font-mono">N/A</div>
            )}
            <span className="text-white font-mono text-xs">{value}</span>
        </div>
    </div>
)

const LoadingCard = ({ title }) => (
    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10 animate-pulse">
        <CardHeader title={title} status="loading" />
        <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 bg-white/5 rounded w-full" />
            ))}
        </div>
    </div>
)

export default function WebAnalysisPage() {
    const [url, setUrl] = useState('instagram.com')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState({})
    const [progress, setProgress] = useState({ completed: 0, total: 0, successful: 0, failed: 0 })
    const [startTime, setStartTime] = useState(null)
    const [duration, setDuration] = useState(null)

    const handleScan = async () => {
        if (!url.trim()) return

        setLoading(true)
        setResults({})
        setProgress({ completed: 0, total: API_ENDPOINTS.length, successful: 0, failed: 0 })
        setStartTime(Date.now())
        setDuration(null)

        // Clean the URL
        const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

        // Call all APIs in parallel
        const promises = API_ENDPOINTS.map(async ({ key, endpoint, name }) => {
            try {
                const res = await fetch(`${API_BASE}${endpoint}?url=${encodeURIComponent(cleanUrl)}`)
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()

                setResults(prev => ({ ...prev, [key]: { data, status: 'success' } }))
                setProgress(prev => ({
                    ...prev,
                    completed: prev.completed + 1,
                    successful: prev.successful + 1
                }))
                return { key, success: true, data }
            } catch (error) {
                setResults(prev => ({ ...prev, [key]: { error: error.message, status: 'error' } }))
                setProgress(prev => ({
                    ...prev,
                    completed: prev.completed + 1,
                    failed: prev.failed + 1
                }))
                return { key, success: false, error }
            }
        })

        await Promise.allSettled(promises)
        setLoading(false)
        setDuration(((Date.now() - Date.now()) / 1000).toFixed(2))
    }

    const hasResults = Object.keys(results).length > 0

    // Helper to safely get data
    const getData = (key) => results[key]?.data
    const getStatus = (key) => results[key]?.status || 'loading'

    // Format response time
    const formatResponseTime = (ms) => {
        if (!ms) return '-'
        return ms > 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">

            {/* Header / Input */}
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="flex items-center gap-4 flex-1">
                    <Globe className="text-neon-green" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold text-white leading-none">Web Analysis</h1>
                        <div className="text-xs text-foreground/40 font-mono mt-1">ADVANCED INTELLIGENCE SCANNER</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-[2]">
                    <input
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleScan()}
                        placeholder="Enter domain (e.g., instagram.com)"
                        className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white font-mono focus:border-neon-green/50 outline-none"
                    />
                    <Button onClick={handleScan} disabled={loading} className="whitespace-nowrap">
                        {loading ? 'Scanning...' : 'Run Analysis'}
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            {(loading || hasResults) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2"
                >
                    <div className="flex justify-between text-xs font-mono mb-1">
                        <div className="space-x-4">
                            <span className="text-neon-green">{progress.successful} jobs successful</span>
                            <span className="text-red-500">{progress.failed} jobs failed</span>
                        </div>
                        <span className="text-foreground/40">
                            {loading ? `${progress.completed}/${progress.total} completed` : `Finished`}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-neon-green to-neon-yellow"
                        />
                    </div>
                </motion.div>
            )}

            {/* Main Grid */}
            {hasResults && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >

                    {/* Status & Response Time */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Status" icon={Activity} status={getStatus('status')} />
                        {getData('status') ? (
                            <div className="space-y-1">
                                <InfoRow label="Is Up" value={getData('status').isUp ? '✓ Online' : '✗ Offline'} />
                                <InfoRow label="Response Code" value={getData('status').responseCode} />
                                <InfoRow label="Response Time" value={formatResponseTime(getData('status').responseTime)} />
                                <InfoRow label="DNS Lookup" value={formatResponseTime(getData('status').dnsLookupTime)} />
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* IP & Server Info */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Server Info" icon={Server} status={getStatus('getIp')} />
                        {getData('getIp') ? (
                            <div className="space-y-1">
                                <InfoRow label="IP Address" value={getData('getIp').ip} />
                                <InfoRow label="IP Family" value={`IPv${getData('getIp').family}`} />
                                {getData('dnsServer')?.dns?.[0] && (
                                    <>
                                        <InfoRow label="DoH Support" value={getData('dnsServer').dns[0].dohDirectSupports ? 'Yes' : 'No'} />
                                    </>
                                )}
                                {getData('ports') && (
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <div className="text-xs text-foreground/50 mb-2">Open Ports</div>
                                        <div className="flex flex-wrap gap-1">
                                            {getData('ports').openPorts?.map(port => (
                                                <span key={port} className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-mono rounded">{port}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* WHOIS */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Domain WHOIS" icon={FileText} status={getStatus('whois')} />
                        {getData('whois') ? (
                            getData('whois').whois_data?.error ? (
                                <div className="space-y-2">
                                    <InfoRow label="Domain" value={getData('whois').domain} />
                                    <InfoRow label="Source" value={getData('whois').source} />
                                    <div className="mt-3 p-3 rounded bg-yellow-500/10 border border-yellow-500/20 text-center">
                                        <div className="text-yellow-500 font-bold text-sm">{getData('whois').whois_data.error}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <InfoRow label="Domain" value={getData('whois').domain} />
                                    <InfoRow label="Source" value={getData('whois').source} />
                                    <InfoRow label="Registrar" value={getData('whois').whois_data?.registrar || getData('whois').registrar} />
                                    <InfoRow label="Created" value={getData('whois').whois_data?.creationDate || getData('whois').creationDate} />
                                    <InfoRow label="Updated" value={getData('whois').whois_data?.updatedDate || getData('whois').updatedDate} />
                                    <InfoRow label="Expires" value={getData('whois').whois_data?.expiryDate || getData('whois').expiryDate} />
                                    <div className="my-2 h-px bg-white/10" />
                                    <div className="text-xs font-mono text-foreground/40 break-all">
                                        Registrant: {getData('whois').whois_data?.registrantOrg || getData('whois').whois_data?.registrant || getData('whois').registrantOrg || getData('whois').registrant || '-'}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* DNS Records */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="DNS Records" icon={Wifi} status={getStatus('dns')} />
                        {getData('dns') ? (
                            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {getData('dns').A?.length > 0 && (
                                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                                        <span className="text-neon-yellow font-bold text-xs">A</span>
                                        {getData('dns').A.map((v, i) => (
                                            <span key={i} className="font-mono text-sm text-white/80 break-all">{v}</span>
                                        ))}
                                    </div>
                                )}
                                {getData('dns').AAAA?.length > 0 && (
                                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                                        <span className="text-neon-yellow font-bold text-xs">AAAA</span>
                                        {getData('dns').AAAA.map((v, i) => (
                                            <span key={i} className="font-mono text-sm text-white/80 break-all">{v}</span>
                                        ))}
                                    </div>
                                )}
                                {getData('dns').MX?.length > 0 && (
                                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                                        <span className="text-neon-yellow font-bold text-xs">MX</span>
                                        {getData('dns').MX.map((mx, i) => (
                                            <span key={i} className="font-mono text-sm text-white/80 break-all">{mx.exchange} (priority: {mx.preference})</span>
                                        ))}
                                    </div>
                                )}
                                {getData('dns').NS?.length > 0 && (
                                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                                        <span className="text-neon-yellow font-bold text-xs">NS</span>
                                        {getData('dns').NS.map((v, i) => (
                                            <span key={i} className="font-mono text-sm text-white/80 break-all">{v}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* HTTP Security Headers */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="HTTP Security" icon={Shield} status={getStatus('headers')} />
                        {getData('headers') ? (
                            <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {Object.entries(getData('headers')).slice(0, 8).map(([key, value], i) => (
                                    <StatusRow
                                        key={i}
                                        label={key.replace(/-/g, ' ')}
                                        value={typeof value === 'string' ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : 'Yes'}
                                        status={value ? 'pass' : 'fail'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* HSTS */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="HSTS Policy" icon={Lock} status={getStatus('hsts')} />
                        {getData('hsts') ? (
                            <div className="space-y-1">
                                <InfoRow label="HSTS Enabled" value={getData('hsts').present ? 'Yes' : 'No'} />
                                {getData('hsts').policy && (
                                    <>
                                        <InfoRow label="Max Age" value={`${getData('hsts').policy.max_age}s`} />
                                        <InfoRow label="Include Subdomains" value={getData('hsts').policy.includeSubDomains ? 'Yes' : 'No'} />
                                        <InfoRow label="Preload" value={getData('hsts').policy.preload ? 'Yes' : 'No'} />
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Tech Stack */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Tech Stack" status={getStatus('techStack')} />
                        {getData('techStack')?.technologies ? (
                            <div className="space-y-3">
                                {Object.entries(getData('techStack').technologies).map(([category, techs]) => (
                                    techs?.length > 0 && (
                                        <div key={category} className="flex flex-col gap-1">
                                            <span className="text-foreground/50 text-xs uppercase">{category}</span>
                                            <div className="flex flex-wrap gap-1">
                                                {techs.map((tech, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-neon-green/10 text-neon-green text-xs font-mono rounded">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Cookies */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Cookies" icon={Cookie} status={getStatus('cookies')} />
                        {getData('cookies') ? (
                            <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {getData('cookies').clientCookies?.map((cookie, i) => (
                                    <div key={i} className="p-2 bg-white/5 rounded">
                                        <div className="font-mono text-sm text-white">{cookie.name}</div>
                                        <div className="text-xs text-foreground/50 mt-1 flex gap-2">
                                            {cookie.secure && <span className="text-green-500">Secure</span>}
                                            {cookie.httpOnly && <span className="text-yellow-500">HttpOnly</span>}
                                            <span>{cookie.domain}</span>
                                        </div>
                                    </div>
                                ))}
                                {(!getData('cookies').clientCookies || getData('cookies').clientCookies.length === 0) && (
                                    <div className="text-foreground/40 text-sm">No cookies found</div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Redirects */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Redirects" icon={ExternalLink} status={getStatus('redirects')} />
                        {getData('redirects') ? (
                            <div className="space-y-2">
                                {getData('redirects').redirects?.map((redirect, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-neon-yellow font-mono text-xs">{i + 1}</span>
                                        <span className="font-mono text-sm text-white/80 break-all">{redirect}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Social Tags */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Social Tags" status={getStatus('socialTags')} />
                        {getData('socialTags') ? (
                            <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-foreground/70 font-bold text-sm">Title</span>
                                    <span className="text-white text-sm break-words">{getData('socialTags').title || '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-foreground/70 font-bold text-sm">OG Title</span>
                                    <span className="text-white text-sm break-words">{getData('socialTags').ogTitle || '-'}</span>
                                </div>
                                <InfoRow label="OG Site" value={getData('socialTags').ogSiteName} />
                                <div className="my-2 h-px bg-white/10" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-foreground/70 font-bold text-sm">Description</span>
                                    <span className="text-foreground/50 text-xs break-words whitespace-pre-wrap">
                                        {getData('socialTags').description || 'No description'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Firewall/WAF */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Firewall Detection" icon={Shield} status={getStatus('firewall')} />
                        {getData('firewall') ? (
                            <div className="space-y-2">
                                <InfoRow label="WAF Detected" value={getData('firewall').hasWaf ? 'Yes' : 'No'} />
                                {getData('firewall').waf && (
                                    <InfoRow label="WAF Provider" value={getData('firewall').waf} />
                                )}
                                <div className={`mt-4 p-3 rounded text-center ${getData('firewall').hasWaf ? 'bg-neon-green/10 border border-neon-green/30' : 'bg-red-500/10 border border-red-500/20'}`}>
                                    <div className={`font-bold text-sm ${getData('firewall').hasWaf ? 'text-neon-green' : 'text-red-400'}`}>
                                        {getData('firewall').hasWaf ? `Protected by ${getData('firewall').waf}` : (getData('firewall').message || 'No WAF detected')}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Carbon Footprint */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Carbon Footprint" status={getStatus('carbon')} />
                        {getData('carbon') ? (
                            <div className="space-y-1">
                                <InfoRow label="Rating" value={getData('carbon').rating} />
                                <InfoRow label="CO2 (g)" value={getData('carbon').gco2e?.toFixed(4)} />
                                <InfoRow label="Cleaner Than" value={`${(getData('carbon').cleanerThan * 100).toFixed(0)}% of sites`} />
                                <InfoRow label="Green Hosting" value={getData('carbon').green ? 'Yes' : 'No'} />
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                </motion.div>
            )}

            {/* Empty State */}
            {!loading && !hasResults && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-foreground/40">
                    <Activity size={64} strokeWidth={1} className="mb-4 text-neon-green/20" />
                    <p className="font-mono tracking-wider">ENTER URL TO INITIALIZE SCANNER</p>
                </div>
            )}
        </div>
    )
}
