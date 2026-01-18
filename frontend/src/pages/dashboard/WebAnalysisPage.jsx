import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, Shield, ShieldAlert, Activity, List, Server, TriangleAlert, CheckCircle, Clock, MapPin, Lock, FileText, Share2, Info, ChevronDown, ChevronUp, AlertCircle, Wifi, Mail, Link2, Cookie, ExternalLink } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const API_BASE = 'http://localhost:5001/api/web-analyzer'

// API endpoint configuration
const API_ENDPOINTS = [
    { key: 'status', endpoint: '/status', name: 'Status Check' },
    { key: 'dns', endpoint: '/dns', name: 'DNS Records' },
    { key: 'headers', endpoint: '/headers', name: 'HTTP Headers' },
    { key: 'securityHeaders', endpoint: '/security-headers', name: 'Security Headers' },
    { key: 'securityTxt', endpoint: '/security-txt', name: 'Security.txt' },
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
    { key: 'traceRoute', endpoint: '/trace-route', name: 'Trace Route' },
    { key: 'tls', endpoint: '/tls', name: 'TLS Configuration' },
    { key: 'rank', endpoint: '/rank', name: 'Domain Rank' },
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

                    {/* Sitemap */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Sitemap" icon={List} status={getStatus('sitemap')} />
                        {getData('sitemap') ? (
                            <div className="space-y-2">
                                <InfoRow label="Entries found" value={getData('sitemap').count} />
                                <div className="text-xs text-foreground/40 truncate" title={getData('sitemap').url}>{getData('sitemap').url}</div>
                                {getData('sitemap').entries?.length > 0 && (
                                    <div className="max-h-[100px] overflow-y-auto custom-scrollbar mt-2 bg-white/5 p-2 rounded">
                                        {getData('sitemap').entries.slice(0, 50).map((u, i) => (
                                            <div key={i} className="text-xs text-foreground/60 truncate">{u}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Block Lists */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Block Lists" icon={Shield} status={getStatus('blockLists')} />
                        {getData('blockLists') ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${getData('blockLists').blocked ? 'text-red-500' : 'text-green-500'}`}>
                                        {getData('blockLists').blocked ? 'BLOCKED' : 'CLEAN'}
                                    </span>
                                    {getData('blockLists').blocked && <ShieldAlert className="text-red-500" />}
                                </div>
                                {getData('blockLists').lists && (
                                    <div className="text-xs text-foreground/50">Checked {Object.keys(getData('blockLists').lists).length} lists</div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Security Headers (Detailed) */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Security Headers" icon={Shield} status={getStatus('securityHeaders')} />
                        {getData('securityHeaders') ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-foreground/70">Security Score</span>
                                    <span className={`text-xl font-bold ${getData('securityHeaders').score >= 70 ? 'text-green-500' : getData('securityHeaders').score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {getData('securityHeaders').score}/100
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getData('securityHeaders').score >= 70 ? 'bg-green-500' : getData('securityHeaders').score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${getData('securityHeaders').score}%` }}
                                    />
                                </div>

                                <div className="pt-2">
                                    <div className="text-xs text-foreground/50 mb-2 font-mono uppercase">Missing Headers</div>
                                    <div className="flex flex-wrap gap-2">
                                        {getData('securityHeaders').missing?.length > 0 ? getData('securityHeaders').missing.map(h => (
                                            <span key={h} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded font-mono">{h}</span>
                                        )) : <span className="text-green-500 text-xs">None!</span>}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="text-xs text-foreground/50 mb-2 font-mono uppercase">Present Headers</div>
                                    <div className="max-h-[150px] overflow-y-auto custom-scrollbar space-y-2">
                                        {Object.entries(getData('securityHeaders').present || {}).map(([key, val]) => (
                                            <div key={key} className="text-xs">
                                                <span className="text-green-400 font-mono block">{key}</span>
                                                <span className="text-white/60 truncate block" title={val}>{val.length > 50 ? val.substring(0, 50) + '...' : val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Security.txt */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Security.txt" icon={FileText} status={getStatus('securityTxt')} />
                        {getData('securityTxt') ? (
                            <div className="space-y-3">
                                <InfoRow label="Found" value={getData('securityTxt').found ? 'Yes' : 'No'} />
                                {getData('securityTxt').found && (
                                    <>
                                        {getData('securityTxt').fields?.contact && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-foreground/70 font-bold text-sm">Contact</span>
                                                {getData('securityTxt').fields.contact.map((c, i) => (
                                                    <a key={i} href={c} target="_blank" rel="noopener noreferrer" className="text-neon-green text-xs hover:underline truncate">{c}</a>
                                                ))}
                                            </div>
                                        )}
                                        {getData('securityTxt').fields?.expires && (
                                            <InfoRow label="Expires" value={new Date(getData('securityTxt').fields.expires[0]).toLocaleDateString()} />
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* TLS Info */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="TLS Configuration" icon={Lock} status={getStatus('tls')} />
                        {getData('tls') ? (
                            <div className="space-y-1">
                                <InfoRow label="Valid Cert" value={getData('tls').validCertificate ? 'Yes' : 'No'} />
                                <InfoRow label="Version" value={getData('tls').tlsVersion} />
                                <InfoRow label="Cipher" value={getData('tls').cipher?.name?.replace(/_/g, ' ')} />
                                {getData('tls').certificateIssuer && (
                                    <div className="mt-2 pt-2 border-t border-white/5">
                                        <div className="text-xs text-foreground/50 mb-1">Issuer</div>
                                        <div className="text-sm text-white">{getData('tls').certificateIssuer.organizationName}</div>
                                        <div className="text-xs text-foreground/40">{getData('tls').certificateIssuer.commonName}</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Trace Route */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10 md:col-span-2">
                        <CardHeader title="Trace Route" icon={Share2} status={getStatus('traceRoute')} />
                        {getData('traceRoute') ? (
                            <div className="space-y-2">
                                <div className="text-xs text-foreground/50 mb-2">Resolved IP: {getData('traceRoute').resolved_ip}</div>
                                {getData('traceRoute').hops?.length > 0 ? (
                                    <div className="relative pt-2">
                                        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/10" />
                                        {getData('traceRoute').hops.map((hop, i) => (
                                            <div key={i} className="flex items-start gap-4 mb-3 relative pl-8">
                                                <div className="absolute left-[5px] top-[6px] w-1.5 h-1.5 rounded-full bg-neon-green" />
                                                <span className="text-neon-yellow font-mono text-xs w-6">{hop.hop}</span>
                                                <div className="flex-1">
                                                    <div className="text-white text-sm font-mono">{hop.ip || hop.info}</div>
                                                    {hop.hostname && <div className="text-xs text-foreground/40">{hop.hostname}</div>}
                                                </div>
                                                <div className="text-xs text-foreground/30 uppercase">{hop.type}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-foreground/50 italic">{getData('traceRoute').message}</div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Rank */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Domain Rank" icon={Activity} status={getStatus('rank')} />
                        {getData('rank') ? (
                            <div className="space-y-3">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white">#{getData('rank').ranks?.[0]?.rank || 'N/A'}</span>
                                    <span className="text-xs text-foreground/40">Current Rank</span>
                                </div>
                                {getData('rank').ranks?.length > 1 && (
                                    <div className="h-[100px] flex items-end gap-1 border-b border-white/10 pb-1">
                                        {getData('rank').ranks.slice(0, 10).reverse().map((r, i) => {
                                            const height = Math.max(10, 100 - (r.rank / 100000)); // normalized logic
                                            return (
                                                <div key={i} className="flex-1 bg-neon-green/20 hover:bg-neon-green/40 transition-colors rounded-t relative group" style={{ height: '40%' }}>
                                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                                        #{r.rank} ({r.date})
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Mail Config */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Mail Configuration" icon={Mail} status={getStatus('mailConfig')} />
                        {getData('mailConfig') ? (
                            <div className="space-y-3">
                                {getData('mailConfig').mailServices?.length > 0 && (
                                    <div>
                                        <div className="text-xs text-foreground/50 mb-1">Services</div>
                                        {getData('mailConfig').mailServices.map((s, i) => (
                                            <div key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white">{s.provider}</div>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t border-white/5 pt-2">
                                    <div className="text-xs text-foreground/50 mb-1">MX Records</div>
                                    {getData('mailConfig').mxRecords?.length > 0 ? getData('mailConfig').mxRecords.map((mx, i) => (
                                        <div key={i} className="text-xs font-mono text-white/80">{mx.exchange}</div>
                                    )) : <div className="text-xs text-foreground/30">No MX records</div>}
                                </div>
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* DNSSEC */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="DNSSEC" icon={Lock} status={getStatus('dnssec')} />
                        {getData('dnssec') ? (
                            <div className="space-y-2">
                                <InfoRow label="DNSKEY" value={getData('dnssec').DNSKEY?.isFound ? 'Found' : 'Not Found'} />
                                <InfoRow label="DS Record" value={getData('dnssec').DS?.isFound ? 'Found' : 'Not Found'} />
                                <InfoRow label="RRSIG" value={getData('dnssec').RRSIG?.isFound ? 'Found' : 'Not Found'} />
                                {getData('dnssec').DS?.response?.Status === 0 && (
                                    <div className="mt-2 text-center">
                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">DNSSEC VALIDATED</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Linked Pages */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Linked Pages" icon={Link2} status={getStatus('linkedPages')} />
                        {getData('linkedPages') ? (
                            <div className="text-sm">
                                {getData('linkedPages').skipped ? (
                                    <div className="text-foreground/50 italic p-2 bg-white/5 rounded">
                                        {getData('linkedPages').skipped}
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <InfoRow label="Internal" value={getData('linkedPages').internal?.length || 0} />
                                        <InfoRow label="External" value={getData('linkedPages').external?.length || 0} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* Robots.txt */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Robots.txt" icon={FileText} status={getStatus('robotsTxt')} />
                        {getData('robotsTxt') ? (
                            <div className="text-xs font-mono">
                                {getData('robotsTxt').robots ? (
                                    <div className="max-h-[150px] overflow-y-auto custom-scrollbar bg-black/30 p-2 rounded">
                                        {getData('robotsTxt').robots.slice(0, 10).map((r, i) => (
                                            <div key={i} className={r.type === 'Disallow' ? 'text-red-400' : 'text-green-400'}>
                                                <span className="opacity-50">{r.type}: </span>{r.value}
                                            </div>
                                        ))}
                                        {getData('robotsTxt').robots.length > 10 && (
                                            <div className="text-foreground/30 italic pt-1">...{getData('robotsTxt').robots.length - 10} more rules</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-foreground/40">No robots.txt found</div>
                                )}
                            </div>
                        ) : (
                            <div className="text-foreground/40 text-sm">Loading...</div>
                        )}
                    </div>

                    {/* TXT Records */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="TXT Records" icon={List} status={getStatus('txtRecords')} />
                        {getData('txtRecords') ? (
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-2">
                                {(getData('txtRecords')['adobe-idp-site-verification'] || getData('txtRecords').data || []).toString().split(' ').map((txt, i) => (
                                    <div key={i} className="p-2 bg-white/5 rounded text-xs font-mono text-foreground/80 break-all">
                                        {txt.replace(/"/g, '')}
                                    </div>
                                ))}
                                {Object.keys(getData('txtRecords')).length === 0 && (
                                    <div className="text-foreground/40">No TXT records</div>
                                )}
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
