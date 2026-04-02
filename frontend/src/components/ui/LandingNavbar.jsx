import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Github } from 'lucide-react'

export function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = (id) => {
        setMobileOpen(false)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    const navLinks = [
        { label: 'Tools', action: () => scrollTo('tools') },
        { label: 'Features', action: () => scrollTo('features') },
    ]

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? 'bg-[#05070a]/85 backdrop-blur-2xl border-b border-neon-green/15 shadow-xl shadow-black/30'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 group"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-8 h-8 rounded bg-neon-green flex items-center justify-center text-background font-mono font-bold text-xl"
                        >
                            X
                        </motion.div>
                        <span className="font-mono font-bold text-xl tracking-wider text-white">
                            INTEL<span className="text-neon-green">X</span>
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={link.action}
                                className="relative text-foreground/65 hover:text-neon-green transition-colors duration-300 font-mono text-sm tracking-wide group"
                            >
                                {link.label}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-neon-green group-hover:w-full transition-all duration-300" />
                            </button>
                        ))}
                        <Link
                            to="/docs"
                            className="relative text-foreground/65 hover:text-neon-green transition-colors duration-300 font-mono text-sm tracking-wide group"
                        >
                            Docs
                            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-neon-green group-hover:w-full transition-all duration-300" />
                        </Link>
                        <a
                            href="https://github.com/kshitij-singh06/intelx-frontend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/65 hover:text-white transition-colors duration-300"
                            title="View on GitHub"
                        >
                            <Github size={18} />
                        </a>
                    </div>

                    {/* Right: CTA + Mobile toggle */}
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="hidden sm:block">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-neon-green text-background font-mono font-bold text-sm hover:bg-neon-green/90 transition-colors shadow-lg shadow-neon-green/25"
                            >
                                <Zap size={14} />
                                Get Started
                            </motion.button>
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-white hover:bg-white/5 transition-all"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <X size={22} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <Menu size={22} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Slide-down panel */}
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="fixed top-16 left-0 right-0 z-50 md:hidden bg-[#0a0e17]/98 backdrop-blur-2xl border-b border-neon-green/15"
                        >
                            <div className="p-6 flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={link.action}
                                        className="text-left text-foreground/80 hover:text-neon-green hover:bg-neon-green/5 transition-all font-mono text-base py-3 px-4 rounded-lg"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                                <Link
                                    to="/docs"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-foreground/80 hover:text-neon-green hover:bg-neon-green/5 transition-all font-mono text-base py-3 px-4 rounded-lg"
                                >
                                    Docs
                                </Link>
                                <a
                                    href="https://github.com/kshitij-singh06/intelx-frontend"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 text-foreground/80 hover:text-white hover:bg-white/5 transition-all font-mono text-base py-3 px-4 rounded-lg"
                                >
                                    <Github size={16} />
                                    GitHub
                                </a>

                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                                        <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-neon-green text-background font-mono font-bold text-sm hover:bg-neon-green/90 transition-colors">
                                            <Zap size={15} />
                                            Launch Dashboard
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
