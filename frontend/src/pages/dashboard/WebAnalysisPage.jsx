import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, Shield, Activity, List, Image as ImageIcon, Server, TriangleAlert, CheckCircle, Clock, MapPin, Lock, FileText, Share2, Info, ChevronDown, ChevronUp, PauseCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'

// Advanced Mock Data
const mockDetailedResults = {
    serverLocation: {
        city: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        timezone: 'Europe/London',
        currency: 'Pound (GBP)',
        lat: 51.5074,
        lon: -0.1278,
        isp: 'Facebook, Inc.'
    },
    ssl: {
        subject: '*.facebook.com',
        issuer: 'DigiCert Inc',
        validFrom: '25 January 2026',
        validTo: '26 October 2025',
        serial: '0AB31BBA855404C23CD...',
        fingerprint: '95:0E:9F:85:9D:2B:5...',
        grade: 'A+'
    },
    whois: {
        registrar: 'RegistrarSafe, LLC',
        created: '29 March 1997',
        expires: '2034-03-30',
        updated: '24 April 2025',
        domainId: '2320948_DOMAIN_COM-VRSN'
    },
    headers: [
        { name: 'Content-Security-Policy', value: 'Yes', status: 'pass' },
        { name: 'Strict-Transport-Security', value: 'Yes', status: 'pass' },
        { name: 'X-Content-Type-Options', value: 'Yes', status: 'pass' },
        { name: 'X-Frame-Options', value: 'DENY', status: 'pass' },
        { name: 'X-XSS-Protection', value: 'Yes', status: 'pass' },
        { name: 'Referrer-Policy', value: 'origin-when-cross-origin', status: 'pass' }
    ],
    dns: [
        { type: 'A', value: '57.144.240.1' },
        { type: 'AAAA', value: '2a03:2880:f378:1:face:b00c:0:25de' },
        { type: 'MX', value: 'msgin.vvv.facebook.com' },
        { type: 'TXT', value: 'v=spf1 redirect=_spf.facebook.com' }
    ],
    serverInfo: {
        ip: '57.144.240.1',
        server: 'proxygen-bolt',
        poweredBy: 'HHVM/4.153.1'
    }
}

const CardHeader = ({ title, icon: Icon, info }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-neon-green">{title}</h3>
        </div>
        <div className="flex gap-2 text-foreground/40">
            <Info size={16} className="cursor-pointer hover:text-white" />
            <Share2 size={16} className="cursor-pointer hover:text-white" />
        </div>
    </div>
)

const InfoRow = ({ label, value, flag }) => (
    <div className="flex justify-between items-center py-1 text-sm">
        <span className="text-foreground/70 font-bold">{label}</span>
        <div className="flex items-center gap-2 text-white font-mono text-right">
            {value}
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
            ) : (
                <div className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-xs font-bold font-mono">FAIL</div>
            )}
            <span className="text-white font-mono text-xs">{value}</span>
        </div>
    </div>
)

export default function WebAnalysisPage() {
    const [url, setUrl] = useState('facebook.com')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)

    // Auto-load simplified mockup for demo
    useState(() => {
        // In real app, we wait for scan
        // setResults(mockDetailedResults) 
    }, [])

    const handleScan = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setResults(mockDetailedResults)
        }, 1500)
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
                        className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white font-mono focus:border-neon-green/50 outline-none"
                    />
                    <Button onClick={handleScan} disabled={loading} className="whitespace-nowrap">
                        {loading ? 'Scanning...' : 'Run Analysis'}
                    </Button>
                </div>
            </div>

            {/* Progress Bar (Always visible if results) */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2"
                >
                    <div className="flex justify-between text-xs font-mono mb-1">
                        <div className="space-x-4">
                            <span className="text-neon-green">25 jobs successful</span>
                            <span className="text-red-500">0 jobs failed</span>
                        </div>
                        <span className="text-foreground/40">Finished in 1.5s</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-neon-green to-neon-yellow"
                        />
                    </div>
                </motion.div>
            )}

            {/* Main Grid */}
            {results && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >

                    {/* Server Location */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Server Location" />
                        <div className="space-y-1 mb-4">
                            <InfoRow label="City" value={results.serverLocation.city} />
                            <InfoRow label="Country" value={results.serverLocation.country} flag="🇬🇧" />
                            <InfoRow label="Timezone" value={results.serverLocation.timezone} />
                            <InfoRow label="Currency" value={results.serverLocation.currency} />
                        </div>
                        <div className="h-40 rounded-lg bg-white/5 relative overflow-hidden flex items-center justify-center border border-white/5">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center" />
                            <MapPin className="text-neon-green relative z-10 animate-bounce" />
                        </div>
                    </div>

                    {/* SSL Certificate */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="SSL Certificate" />
                        <div className="space-y-1">
                            <InfoRow label="Subject" value={results.ssl.subject} />
                            <InfoRow label="Issuer" value={results.ssl.issuer} />
                            <InfoRow label="Valid From" value={results.ssl.validFrom} />
                            <InfoRow label="Valid To" value={results.ssl.validTo} />
                            <div className="my-2 h-px bg-white/10" />
                            <InfoRow label="Serial" value={results.ssl.serial} />
                            <InfoRow label="Fingerprint" value={results.ssl.fingerprint} />
                        </div>
                    </div>

                    {/* HTTP Security */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="HTTP Security" />
                        <div className="space-y-2">
                            {results.headers.map((h, i) => (
                                <StatusRow key={i} label={h.name} value={h.value} status={h.status} />
                            ))}
                        </div>
                    </div>

                    {/* DNS Records */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="DNS Records" />
                        <div className="space-y-3">
                            {results.dns.map((record, i) => (
                                <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0">
                                    <span className="text-neon-yellow font-bold text-xs">{record.type}</span>
                                    <span className="font-mono text-sm text-white/80 break-all">{record.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Server Info */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Server Info" />
                        <div className="space-y-2">
                            <InfoRow label="IP Address" value={results.serverInfo.ip} />
                            <InfoRow label="Server" value={results.serverInfo.server} />
                            <InfoRow label="Powered By" value={results.serverInfo.poweredBy} />
                            <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-center">
                                <div className="text-red-500 font-bold text-sm">DoH Support Failed</div>
                            </div>
                        </div>
                    </div>

                    {/* Whois */}
                    <div className="p-5 rounded-xl bg-[#0a0e17] border border-white/10">
                        <CardHeader title="Domain Whois" />
                        <div className="space-y-1">
                            <InfoRow label="Registrar" value={results.whois.registrar} />
                            <InfoRow label="Created" value={results.whois.created} />
                            <InfoRow label="Updated" value={results.whois.updated} />
                            <InfoRow label="Expires" value={results.whois.expires} />
                            <div className="my-2 h-px bg-white/10" />
                            <div className="text-xs font-mono text-foreground/40 break-all">
                                ID: {results.whois.domainId}
                            </div>
                        </div>
                    </div>

                </motion.div>
            )}

            {/* Empty State */}
            {!loading && !results && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-foreground/40">
                    <Activity size={64} strokeWidth={1} className="mb-4 text-neon-green/20" />
                    <p className="font-mono tracking-wider">ENTER URL TO INITIALIZE SCANNER</p>
                </div>
            )}
        </div>
    )
}
