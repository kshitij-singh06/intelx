import { motion } from 'framer-motion'
import { Globe, Bug, Radar, Clock, Search, ArrowRight, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

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

const RecentScanRow = ({ target, type, status, time }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${type === 'Web' ? 'bg-neon-green/10 text-neon-green' : type === 'Malware' ? 'bg-red-500/10 text-red-500' : 'bg-neon-yellow/10 text-neon-yellow'}`}>
                {type === 'Web' ? <Globe size={16} /> : type === 'Malware' ? <Bug size={16} /> : <Radar size={16} />}
            </div>
            <div>
                <div className="text-sm font-mono text-white group-hover:text-neon-green transition-colors">{target}</div>
                <div className="text-xs text-foreground/40">{type} Analysis</div>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-neon-green' : 'bg-neon-yellow animate-pulse'}`} />
                <span className="text-xs text-foreground/60">{status}</span>
            </div>
            <div className="text-xs text-foreground/40 font-mono w-24 text-right">{time}</div>
        </div>
    </div>
)

export default function OverviewPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, <span className="text-neon-green">Analyst</span></h2>
                    <p className="text-foreground/60">System status optimal. 3 engines ready for deployment.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-green-500">API ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Main Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="text-foreground/40" />
                </div>
                <input
                    type="text"
                    placeholder="Enter IP, Domain, Hash or Username to start investigation..."
                    className="w-full h-16 pl-12 pr-4 bg-white/[0.03] border border-white/10 rounded-2xl text-lg text-white placeholder:text-foreground/30 focus:border-neon-green/50 focus:bg-white/[0.05] focus:outline-none transition-all font-mono"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <Button variant="primary" className="h-12 px-6">
                        Scan Target
                    </Button>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickActionCard
                    title="Web Analysis"
                    description="Deep scan for vulnerabilities, headers, DNS, and tech stack."
                    icon={Globe}
                    to="/dashboard/web"
                    color="neon-green"
                />
                <QuickActionCard
                    title="Malware Analysis"
                    description="Static and dynamic analysis of suspicious files and hashes."
                    icon={Bug}
                    to="/dashboard/malware"
                    color="red-500" // Tailwind needs full class names for dynamic usage usually, handled via careful class construction or style prop
                />
                <QuickActionCard
                    title="Recon Analysis"
                    description="OSINT gathering for usernames, emails, and exposed data."
                    icon={Radar}
                    to="/dashboard/recon"
                    color="neon-yellow"
                />
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={18} className="text-neon-green" />
                        Recent Investigations
                    </h3>
                    <Button variant="outline" className="text-xs h-8">View All History</Button>
                </div>
                <div className="p-2 space-y-1">
                    <RecentScanRow target="example.com" type="Web" status="Completed" time="2m ago" />
                    <RecentScanRow target="192.168.1.105" type="Web" status="Scanning" time="Running..." />
                    <RecentScanRow target="malicious_payload.exe" type="Malware" status="Completed" time="1h ago" />
                    <RecentScanRow target="john.doe@corp.net" type="Recon" status="Completed" time="3h ago" />
                </div>
            </div>
        </div>
    )
}
