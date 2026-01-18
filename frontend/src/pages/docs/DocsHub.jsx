import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Globe, Bug, Eye, Radar, ArrowRight, BookOpen, Link2 } from 'lucide-react'

const tools = [
    {
        icon: Globe,
        title: 'Web Analysis',
        desc: 'Deep inspection of web headers, DNS, technologies, and vulnerabilities.',
        link: '/docs/web-analyzer',
        color: 'neon-green'
    },
    {
        icon: Bug,
        title: 'Malware Analysis',
        desc: 'Static and dynamic analysis of suspicious files with AI insights.',
        link: '/docs/malware-analysis',
        color: 'red-500'
    },
    {
        icon: Eye,
        title: 'Steg Analysis',
        desc: 'Forensic tools to detect hidden data within images and files.',
        link: '/docs/steg-analysis',
        color: 'purple-400'
    },
    {
        icon: Radar,
        title: 'Recon Analysis',
        desc: 'OSINT gathering and digital footprint investigation.',
        link: '/docs/recon-analysis',
        color: 'neon-yellow'
    },
    {
        icon: Link2,
        title: 'URL Analyzer',
        desc: 'Trace redirect chains and assess link safety for suspicious URLs.',
        link: '/docs/url-analyzer',
        color: 'blue-400'
    }
]

export default function DocsHub() {
    return (
        <div className="space-y-12">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <BookOpen size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">
                    Documentation <span className="text-neon-green">Hub</span>
                </h1>
                <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
                    Comprehensive guides and reference material for the IntelX platform tools.
                    Select a module below to get started.
                </p>
            </motion.div>

            {/* Tool Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool, i) => (
                    <Link key={i} to={tool.link}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="h-full p-6 rounded-2xl bg-[#0a0e17] border border-white/10 hover:border-white/20 group relative overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <div className={`absolute inset-0 bg-${tool.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex items-start gap-4">
                                <div className={`p-4 rounded-xl bg-${tool.color}/10 text-${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <tool.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-foreground/60 text-sm mb-4 leading-relaxed">
                                        {tool.desc}
                                    </p>
                                    <div className={`flex items-center gap-2 text-${tool.color} text-sm font-mono font-bold`}>
                                        Read Docs <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Quick Start Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-xl border border-neon-green/20 bg-neon-green/5 text-center"
            >
                <h4 className="text-neon-green font-bold mb-2 font-mono">Need technical support?</h4>
                <p className="text-sm text-foreground/70">
                    If you encounter any issues with the tools, please check the specific documentation page for troubleshooting steps.
                </p>
            </motion.div>
        </div>
    )
}
