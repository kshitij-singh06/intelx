import { useState, useEffect } from 'react'
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

const SidebarItem = ({ to, icon: Icon, label, collapsed, end, onClick }) => (
    <NavLink
        to={to}
        end={end}
        onClick={onClick}
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
                <Icon size={20} className="stroke-[1.5] flex-shrink-0" />
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
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

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

    const navItems = (
        <>
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" collapsed={collapsed} end onClick={() => setMobileOpen(false)} />
            <div className="my-4 h-px bg-foreground/10 mx-2" />
            <SidebarItem to="/dashboard/web" icon={Globe} label="Web Analysis" collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            <SidebarItem to="/dashboard/malware" icon={Bug} label="Malware Analysis" collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            <SidebarItem to="/dashboard/steg" icon={Eye} label="Steg Analysis" collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            <SidebarItem to="/dashboard/recon" icon={Radar} label="Recon Analysis" collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            <SidebarItem to="/dashboard/url" icon={Link2} label="URL Analyzer" collapsed={collapsed} onClick={() => setMobileOpen(false)} />
        </>
    )

    return (
        <div className="min-h-screen bg-[#05070a] flex text-foreground overflow-hidden font-sans">

            {/* ── Mobile Sidebar Overlay ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 z-40 w-72 flex flex-col border-r border-foreground/10 bg-[#0a0e17]/98 backdrop-blur-xl h-screen lg:hidden"
                        >
                            {/* Logo */}
                            <div className="h-16 flex items-center justify-between px-6 border-b border-foreground/10">
                                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 rounded bg-neon-green flex items-center justify-center text-background font-mono font-bold text-xl">
                                        X
                                    </div>
                                    <span className="font-mono font-bold text-xl tracking-wider text-white">
                                        INTEL<span className="text-neon-green">X</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                                {navItems}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Desktop Sidebar ── */}
            <motion.aside
                initial={false}
                className={`hidden lg:relative lg:z-20 lg:flex flex-col border-r border-foreground/10 bg-[#0a0e17]/80 backdrop-blur-xl h-screen transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-72'}`}
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
                    {navItems}
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

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0d1235] to-transparent opacity-40" />
                    <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[150px]" />
                </div>

                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-foreground/10 bg-[#0a0e17]/50 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 text-foreground/60 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
                            aria-label="Open navigation"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="text-neon-green">/</span>
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Reserved for future actions */}
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative z-10 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
