import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Globe, Bug, Radar, ArrowRight } from 'lucide-react'

const tools = [
    {
        icon: Globe,
        title: 'Web Analysis',
        subtitle: 'WebAnalyser',
        description:
            "WebAnalyser is IntelX's web intelligence engine that analyzes websites and hosts to uncover deep security insights.",
        highlight: '30+ automated OSINT and security checks in seconds',
        features: [
            'IP and DNS intelligence',
            'SSL/TLS configuration and security headers',
            'Cookies, redirects, and crawl rules',
            'Open ports and server fingerprinting',
            'Tech stack detection',
            'Malware and phishing indicators',
        ],
        gradient: 'from-neon-green/20 via-neon-green/5 to-transparent',
        accent: 'neon-green',
    },
    {
        icon: Bug,
        title: 'Malware Analysis',
        subtitle: 'Advanced Forensics',
        description:
            'A powerful static and dynamic malware analysis engine designed for deep inspection of suspicious files.',
        highlight: 'Sandbox-driven forensic analysis',
        features: [
            'VirusTotal signature scanning',
            'Decompiled binary views (Ghidra-powered)',
            'Dynamic execution tracking',
            'Behavioral analysis',
        ],
        gradient: 'from-red-500/20 via-red-500/5 to-transparent',
        accent: 'red-400',
    },
    {
        icon: Radar,
        title: 'Recon Analysis',
        subtitle: 'Digital Footprint',
        description: 'An open reconnaissance toolkit for footprinting, correlation, and digital investigation.',
        highlight: 'Comprehensive threat intelligence gathering',
        features: [
            'DNS, blacklist, and vulnerability lookups',
            'Digital footprint tracking',
            'Username and email correlation',
            'Breach data analysis',
        ],
        gradient: 'from-neon-yellow/20 via-neon-yellow/5 to-transparent',
        accent: 'neon-yellow',
    },
]

export function ToolsOverviewSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 60, rotateX: -10 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    }

    return (
        <section ref={ref} className="py-28 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0d1235] to-background" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-1/4 -left-20 w-64 h-64 bg-neon-green/10 rounded-full blur-[100px]"
                animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-1/4 -right-20 w-64 h-64 bg-neon-yellow/10 rounded-full blur-[100px]"
                animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />

            <motion.div
                className="max-w-7xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                <motion.div className="text-center mb-16" variants={cardVariants}>
                    <motion.span
                        className="inline-block text-neon-green text-xs font-mono tracking-[0.3em] uppercase mb-4 px-4 py-2 border border-neon-green/30 rounded-full bg-neon-green/5"
                    >
                        Core Capabilities
                    </motion.span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground font-mono">
                        Three Tools.{' '}
                        <span className="text-neon-green" style={{ textShadow: '0 0 40px rgba(0, 255, 0, 0.4)' }}>
                            One Platform.
                        </span>
                    </h2>
                    <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg">
                        Comprehensive security intelligence and OSINT capabilities in a unified experience
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="h-full perspective-1000"
                        >
                            <motion.div
                                className="relative h-full rounded-2xl overflow-hidden group"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(21, 26, 51, 0.9) 0%, rgba(10, 14, 39, 0.95) 100%)',
                                    border: '1px solid rgba(0, 255, 0, 0.2)',
                                }}
                                whileHover={{
                                    y: -12,
                                    rotateY: 2,
                                    rotateX: 2,
                                    transition: { duration: 0.4 }
                                }}
                            >
                                {/* Glow effect on hover */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />

                                {/* Top border glow */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${tool.accent} to-transparent opacity-60`} />

                                {/* Content */}
                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    {/* Icon with glow */}
                                    <div className="mb-6">
                                        <motion.div
                                            className={`inline-flex p-4 rounded-xl bg-${tool.accent}/10 border border-${tool.accent}/30`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            style={{
                                                boxShadow: `0 0 30px rgba(0, 255, 0, 0.2)`,
                                            }}
                                        >
                                            <tool.icon size={32} className={`text-${tool.accent}`} style={{ color: index === 1 ? '#f87171' : undefined }} />
                                        </motion.div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-foreground font-mono mb-1">{tool.title}</h3>
                                    <p className={`text-sm text-${tool.accent} font-mono mb-4`} style={{ color: index === 1 ? '#f87171' : undefined }}>
                                        {tool.subtitle}
                                    </p>

                                    {/* Description */}
                                    <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">
                                        {tool.description}
                                    </p>

                                    {/* Highlight box */}
                                    <motion.div
                                        className="mb-6 p-4 rounded-xl border border-neon-yellow/30 bg-neon-yellow/5 relative overflow-hidden"
                                        whileHover={{ borderColor: 'rgba(255, 255, 0, 0.5)' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-yellow/10 via-transparent to-neon-yellow/10 animate-pulse" />
                                        <p className="text-neon-yellow text-sm font-mono font-bold relative z-10">{tool.highlight}</p>
                                    </motion.div>

                                    {/* Features */}
                                    <div className="space-y-3 mb-6">
                                        {tool.features.slice(0, 4).map((feature, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-start gap-3 text-sm text-foreground/60 group/item"
                                                whileHover={{ x: 4, color: 'rgba(224, 224, 224, 0.9)' }}
                                            >
                                                <span className={`text-${tool.accent} mt-0.5`} style={{ color: index === 1 ? '#f87171' : undefined }}>◆</span>
                                                <span className="group-hover/item:text-foreground/90 transition-colors">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <motion.button
                                        className={`mt-auto flex items-center gap-2 text-${tool.accent} font-mono text-sm group/btn`}
                                        style={{ color: index === 1 ? '#f87171' : undefined }}
                                        whileHover={{ x: 4 }}
                                    >
                                        Learn More
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>

                                {/* Animated border */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl pointer-events-none"
                                    style={{
                                        border: '2px solid transparent',
                                        background: 'linear-gradient(var(--background), var(--background)) padding-box, linear-gradient(135deg, rgba(0, 255, 0, 0.3), rgba(255, 255, 0, 0.1), rgba(0, 255, 0, 0.3)) border-box',
                                    }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
