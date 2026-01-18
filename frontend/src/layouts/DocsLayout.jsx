import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Book, Globe, Bug, Radar, Eye, ArrowLeft, Menu, X, ChevronRight } from 'lucide-react'

const DocLink = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
            ${isActive
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
            }
        `}
    >
        <Icon size={18} />
        <span className="font-mono text-sm">{label}</span>
        <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </NavLink>
)

export default function DocsLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const isHub = location.pathname === '/docs'

    return (
        <div className="min-h-screen bg-[#05070a] text-foreground font-sans selection:bg-neon-green/30">

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-yellow/5 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar (Desktop: Fixed, Mobile: Overlay) */}
            <aside className={`
                fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#0a0e17]/95 backdrop-blur-xl border-r border-white/10
                transition-transform duration-300 transform
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col p-6">
                    {/* Header */}
                    <Link to="/" className="flex items-center gap-3 mb-10 group">
                        <div className="w-8 h-8 rounded bg-neon-green flex items-center justify-center text-background font-mono font-bold text-xl group-hover:scale-110 transition-transform">
                            X
                        </div>
                        <span className="font-mono font-bold text-xl tracking-wider text-white">
                            INTEL<span className="text-neon-green">X</span>
                            <span className="text-xs text-foreground/40 ml-2">DOCS</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="mb-6">
                            <div className="text-xs font-mono text-foreground/40 uppercase mb-3 px-4">Platform</div>
                            <DocLink to="/docs" icon={Book} label="Overview & Hub" />
                        </div>

                        <div>
                            <div className="text-xs font-mono text-foreground/40 uppercase mb-3 px-4">Tools</div>
                            <DocLink to="/docs/web-analyzer" icon={Globe} label="Web Analysis" />
                            <DocLink to="/docs/malware-analysis" icon={Bug} label="Malware Analysis" />
                            <DocLink to="/docs/steg-analysis" icon={Eye} label="Steg Analysis" />
                            <DocLink to="/docs/recon-analysis" icon={Radar} label="Recon Analysis" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/10">
                        <Link to="/dashboard">
                            <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-green/20 to-neon-green/5 border border-neon-green/30 text-neon-green font-mono text-sm hover:from-neon-green/30 transition-all flex items-center justify-center gap-2 group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-black/50 border border-white/10 rounded-lg text-white"
            >
                <Menu size={24} />
            </button>
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className={`
                transition-all duration-300 min-h-screen
                lg:pl-72
            `}>
                <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
