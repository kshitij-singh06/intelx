import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import {
    LayoutDashboard,
    Globe,
    Bug,
    Eye,
    Radar,
    Link2,
    Settings,
    Menu,
    X,
    Search,
    Bell
} from 'lucide-react'

const SidebarItem = ({ to, icon: Icon, label, collapsed, end }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
      ${isActive
                ? 'bg-neon-green/10 text-neon-green shadow-[0_0_20px_rgba(0,255,0,0.1)] border border-neon-green/20'
                : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
            }
    `}
    >
        {({ isActive }) => (
            <>
                <Icon size={20} className="stroke-[1.5]" />
                {!collapsed && (
                    <span className="font-mono text-sm tracking-wide">{label}</span>
                )}
                {isActive && !collapsed && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-8 bg-neon-green rounded-r-full"
                    />
                )}
            </>
        )}
    </NavLink>
)

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Overview'
            case '/dashboard/web': return 'Web Analysis'
            case '/dashboard/malware': return 'Malware Analysis'
            case '/dashboard/steg': return 'Steg Analysis'
            case '/dashboard/recon': return 'Recon Analysis'
            case '/dashboard/url': return 'URL Analyzer'
            case '/dashboard/settings': return 'Settings'
            default: return 'Dashboard'
        }
    }

    return (
        <div className="min-h-screen bg-[#05070a] flex text-foreground overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                className={`relative z-20 flex flex-col border-r border-foreground/10 bg-[#0a0e17]/80 backdrop-blur-xl h-screen transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-72'}`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-foreground/10">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded bg-neon-green flex items-center justify-center text-background font-mono font-bold text-xl">
                            X
                        </div>
                        {!collapsed && (
                            <span className="font-mono font-bold text-xl tracking-wider text-white">
                                INTEL<span className="text-neon-green">X</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" collapsed={collapsed} end />
                    <div className="my-4 h-px bg-foreground/10 mx-2" />
                    <SidebarItem to="/dashboard/web" icon={Globe} label="Web Analysis" collapsed={collapsed} />
                    <SidebarItem to="/dashboard/malware" icon={Bug} label="Malware Analysis" collapsed={collapsed} />
                    <SidebarItem to="/dashboard/steg" icon={Eye} label="Steg Analysis" collapsed={collapsed} />
                    <SidebarItem to="/dashboard/recon" icon={Radar} label="Recon Analysis" collapsed={collapsed} />
                    <SidebarItem to="/dashboard/url" icon={Link2} label="URL Analyzer" collapsed={collapsed} />
                </nav>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-foreground/10">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full mt-2 flex items-center justify-center p-2 text-foreground/40 hover:text-foreground transition-colors"
                    >
                        {collapsed ? <Menu size={20} /> : <div className="flex items-center gap-2 text-xs font-mono uppercase">Collapse Sidebar</div>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0d1235] to-transparent opacity-40" />
                    <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[150px]" />
                </div>

                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-foreground/10 bg-[#0a0e17]/50 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="text-neon-green">/</span>
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Removed */}
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative z-10 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
