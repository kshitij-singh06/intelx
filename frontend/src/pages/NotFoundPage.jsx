import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, LayoutDashboard, AlertTriangle, Terminal } from 'lucide-react'

function CyberBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#05070a] to-[#0a0e27]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neon-green/5 rounded-full blur-[150px]" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px]" />

            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
                <defs>
                    <pattern id="404-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00ff00" strokeWidth="0.4" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#404-grid)" />
            </svg>

            {/* Corner accents */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-neon-green/30" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-red-500/30" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-red-500/30" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-neon-green/30" />
        </div>
    )
}

export default function NotFoundPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 },
        },
    }
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
    }

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center px-4 relative overflow-hidden font-sans">
            <CyberBackground />

            <motion.div
                className="relative z-10 text-center max-w-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Alert badge */}
                <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 font-mono text-xs tracking-widest uppercase">
                        <AlertTriangle size={13} />
                        Signal Lost
                    </div>
                </motion.div>

                {/* 404 Number */}
                <motion.div variants={itemVariants} className="relative mb-6">
                    <h1
                        className="text-[10rem] sm:text-[14rem] font-bold font-mono leading-none text-transparent select-none"
                        style={{
                            WebkitTextStroke: '2px rgba(0, 255, 0, 0.4)',
                            textShadow: '0 0 80px rgba(0, 255, 0, 0.25)',
                        }}
                    >
                        404
                    </h1>
                    <motion.div
                        className="absolute inset-0 text-[10rem] sm:text-[14rem] font-bold font-mono leading-none text-neon-green/10 select-none blur-xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        404
                    </motion.div>
                </motion.div>

                {/* Message */}
                <motion.h2
                    variants={itemVariants}
                    className="text-2xl sm:text-3xl font-bold text-white font-mono mb-4"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-foreground/55 text-base mb-10 max-w-md mx-auto"
                >
                    The route you're targeting doesn't exist in this system.
                    Double-check the URL or navigate back to safety.
                </motion.p>

                {/* Terminal block */}
                <motion.div
                    variants={itemVariants}
                    className="mb-10 mx-auto max-w-sm p-4 rounded-xl bg-black/40 border border-foreground/10 text-left font-mono text-xs"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Terminal size={12} className="text-neon-green" />
                        <span className="text-foreground/40">intelx — terminal</span>
                    </div>
                    <p className="text-foreground/50">
                        <span className="text-neon-green">$</span> navigate --to {typeof window !== 'undefined' ? window.location.pathname : '/unknown'}
                    </p>
                    <motion.p
                        className="text-red-400 mt-1"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ✗ ERROR: Route not found (code 404)
                    </motion.p>
                    <p className="text-foreground/30 mt-1">
                        <span className="text-neon-green">$</span> _
                        <motion.span
                            className="inline-block w-1.5 h-3 bg-neon-green ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                        />
                    </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-green text-background font-mono font-bold text-sm hover:bg-neon-green/90 transition-colors shadow-lg shadow-neon-green/25 w-full sm:w-auto justify-center"
                        >
                            <Home size={16} />
                            Back to Home
                        </motion.button>
                    </Link>
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-foreground/20 text-foreground/80 hover:text-white hover:border-neon-green/40 hover:bg-neon-green/5 font-mono font-bold text-sm transition-all w-full sm:w-auto justify-center"
                        >
                            <LayoutDashboard size={16} />
                            Open Dashboard
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}
