import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Zap, Shield, Search } from 'lucide-react'

// Animated background component with particles and grid
function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Deep space gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#0d1235] to-[#0a0e27]" />

            {/* Radial glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-yellow/5 rounded-full blur-[100px]" />

            {/* Animated cyber grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                <defs>
                    <pattern id="cyber-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="url(#grid-gradient)" strokeWidth="0.5" />
                    </pattern>
                    <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00ff00" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ffff00" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#cyber-grid)" />
            </svg>

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${i % 3 === 0 ? 'bg-neon-green' : 'bg-neon-yellow'}`}
                    style={{
                        width: Math.random() * 4 + 2,
                        height: Math.random() * 4 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Horizontal scan lines */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent"
                        initial={{ top: `${i * 25}%`, opacity: 0 }}
                        animate={{
                            top: [`${i * 25}%`, `${(i * 25 + 100) % 100}%`],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-green/30" />
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-yellow/30" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-yellow/30" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-green/30" />
        </div>
    )
}

export function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    }

    const offerings = [
        { icon: Zap, label: 'Web Analysis', desc: 'Deep website intelligence', link: '/dashboard/web' },
        { icon: Shield, label: 'Malware Analysis', desc: 'Forensic file inspection', link: '/dashboard/malware' },
        { icon: Search, label: 'Recon Analysis', desc: 'Digital footprint tracking', link: '/dashboard/recon' },
    ]

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            <AnimatedBackground />

            <motion.div
                className="relative z-10 max-w-5xl text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo/Brand text */}
                <motion.div variants={itemVariants} className="mb-8">
                    <motion.span
                        className="inline-block text-neon-yellow text-xs sm:text-sm font-mono tracking-[0.4em] uppercase px-4 py-2 border border-neon-yellow/30 rounded-full bg-neon-yellow/5"
                        whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 0, 0.6)' }}
                    >
                        ◈ Intelligence Platform ◈
                    </motion.span>
                </motion.div>

                {/* Main headline with glow effect */}
                <motion.div variants={itemVariants} className="relative mb-8">
                    <motion.h1
                        className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-foreground font-mono relative z-10"
                        style={{
                            textShadow: '0 0 60px rgba(0, 255, 0, 0.3), 0 0 120px rgba(0, 255, 0, 0.1)'
                        }}
                    >
                        Intel<span className="text-neon-green">X</span>
                    </motion.h1>
                    {/* Glow backdrop */}
                    <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-neon-green via-neon-yellow to-neon-green -z-10" />
                </motion.div>

                {/* Tagline with typewriter caret */}
                <motion.div variants={itemVariants} className="mb-4">
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 font-medium">
                        "X-Ray vision for the modern internet."
                        <motion.span
                            className="inline-block w-0.5 h-8 bg-neon-green ml-2 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    </p>
                </motion.div>

                {/* Supporting line */}
                <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-lg text-foreground/60 mb-14 max-w-xl mx-auto"
                >
                    Unlock X-Ray Vision – See What Attackers See in Just 20 Seconds
                </motion.p>

                {/* What We Offer Box - Enhanced glassmorphism */}
                <motion.div variants={itemVariants} className="mb-14 mx-auto max-w-lg">
                    <motion.div
                        className="relative p-8 rounded-2xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.08) 0%, rgba(255, 255, 0, 0.04) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 255, 0, 0.3)',
                            boxShadow: '0 0 40px rgba(0, 255, 0, 0.15), inset 0 0 60px rgba(0, 255, 0, 0.05)',
                        }}
                        whileHover={{
                            boxShadow: '0 0 60px rgba(0, 255, 0, 0.25), inset 0 0 80px rgba(0, 255, 0, 0.08)',
                        }}
                    >
                        {/* Animated border glow */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.4), transparent)',
                                backgroundSize: '200% 100%',
                            }}
                            animate={{
                                backgroundPosition: ['200% 0', '-200% 0'],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Scan line effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-neon-green/20 via-transparent to-transparent pointer-events-none"
                            animate={{ y: ['0%', '200%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />

                        <div className="relative z-10">
                            <h3 className="text-xl font-mono text-neon-green mb-6 font-bold tracking-wider flex items-center justify-center gap-2">
                                <span className="w-8 h-px bg-gradient-to-r from-transparent to-neon-green" />
                                What We Offer
                                <span className="w-8 h-px bg-gradient-to-l from-transparent to-neon-green" />
                            </h3>
                            <div className="space-y-4">
                                {offerings.map((item, index) => (
                                    <Link key={index} to={item.link}>
                                        <motion.div
                                            className="flex items-center gap-4 p-3 rounded-xl bg-background/30 border border-transparent hover:border-neon-green/30 transition-all group mb-4 last:mb-0"
                                            whileHover={{ x: 8, backgroundColor: 'rgba(0, 255, 0, 0.05)' }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 + index * 0.1 }}
                                        >
                                            <span className="text-neon-yellow p-2 rounded-lg bg-neon-yellow/10 group-hover:bg-neon-yellow/20 transition-colors">
                                                <item.icon size={22} />
                                            </span>
                                            <div className="text-left">
                                                <span className="font-mono text-base text-foreground block">{item.label}</span>
                                                <span className="text-xs text-foreground/50">{item.desc}</span>
                                            </div>
                                            <motion.span
                                                className="ml-auto text-neon-green opacity-0 group-hover:opacity-100 transition-opacity"
                                                initial={{ x: -10 }}
                                                whileHover={{ x: 0 }}
                                            >
                                                →
                                            </motion.span>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/dashboard">
                            <Button variant="primary" className="text-base px-10 py-5 shadow-lg shadow-neon-green/30">
                                Get Started
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            className="text-base px-10 py-5"
                            onClick={() => {
                                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >
                            Explore Tools
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}
