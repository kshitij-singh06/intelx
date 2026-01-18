import { motion } from 'framer-motion'
import { Globe, Bug, Radar, Search, ArrowRight, Eye, Link2 } from 'lucide-react'
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



export default function OverviewPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, <span className="text-neon-green">Analyst</span></h2>
                    <p className="text-foreground/60">System status optimal. 5 engines ready for deployment.</p>
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

            {/* Quick Actions Grid - First Row (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    color="red-500"
                />
                <QuickActionCard
                    title="Recon Analysis"
                    description="OSINT for users and exposed data."
                    icon={Radar}
                    to="/dashboard/recon"
                    color="neon-yellow"
                />
            </div>

            {/* Quick Actions Grid - Second Row (2 centered cards) */}
            <div className="flex justify-center gap-4">
                <div className="w-full max-w-sm">
                    <QuickActionCard
                        title="Steg Analysis"
                        description="Detect hidden data in files."
                        icon={Eye}
                        to="/dashboard/steg"
                        color="purple-500"
                    />
                </div>
                <div className="w-full max-w-sm">
                    <QuickActionCard
                        title="URL Analyzer"
                        description="Trace redirects & assess safety."
                        icon={Link2}
                        to="/dashboard/url"
                        color="blue-500"
                    />
                </div>
            </div>
        </div>
    )
}
