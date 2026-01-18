import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Shield, Network, AlertTriangle, Code, Server, Search, Lock, Users, ChevronRight } from 'lucide-react'

export function IntroductionSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    }

    const identifyItems = [
        { icon: Target, text: 'Potential attack vectors' },
        { icon: Shield, text: 'Existing security controls' },
        { icon: Network, text: 'Infrastructure relationships' },
        { icon: AlertTriangle, text: 'Misconfigurations and risks' },
    ]

    const builtForItems = [
        { icon: Code, text: 'Developers' },
        { icon: Server, text: 'System administrators' },
        { icon: Search, text: 'Security researchers' },
        { icon: Lock, text: 'Penetration testers' },
        { icon: Users, text: 'Curious technologists' },
    ]

    return (
        <section ref={ref} className="py-28 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0d1235]/50 to-background" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute left-0 top-1/4 w-32 h-px bg-gradient-to-r from-neon-green/50 to-transparent" />
            <div className="absolute left-0 top-1/4 w-px h-32 bg-gradient-to-b from-neon-green/50 to-transparent" />
            <div className="absolute right-0 bottom-1/4 w-32 h-px bg-gradient-to-l from-neon-yellow/50 to-transparent" />
            <div className="absolute right-0 bottom-1/4 w-px h-32 bg-gradient-to-t from-neon-yellow/50 to-transparent" />

            <motion.div
                className="max-w-5xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {/* Section header */}
                <motion.div variants={itemVariants} className="mb-12">
                    <motion.span
                        className="inline-block text-neon-green text-xs font-mono tracking-[0.3em] uppercase mb-4 px-4 py-2 border border-neon-green/30 rounded-full bg-neon-green/5"
                    >
                        About
                    </motion.span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground font-mono">
                        What is{' '}
                        <span className="text-neon-green" style={{ textShadow: '0 0 40px rgba(0, 255, 0, 0.4)' }}>
                            IntelX
                        </span>
                        ?
                    </h2>
                </motion.div>

                {/* Main description with terminal style */}
                <motion.div
                    variants={itemVariants}
                    className="relative mb-12 p-6 rounded-xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, rgba(21, 26, 51, 0.8) 100%)',
                        border: '1px solid rgba(0, 255, 0, 0.2)',
                    }}
                >
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-foreground/10">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-4 text-foreground/40 font-mono text-xs">intelx --about</span>
                    </div>

                    <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-mono">
                        <span className="text-neon-green">→</span> IntelX is a powerful all-in-one cybersecurity intelligence and OSINT platform.
                        It aggregates, correlates, and visualizes open-source and security intelligence
                        from multiple sources to help users understand attack surfaces, threats, and
                        infrastructure exposure.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* IntelX helps identify */}
                    <motion.div
                        variants={itemVariants}
                        className="p-6 rounded-xl"
                        style={{
                            background: 'linear-gradient(180deg, rgba(0, 255, 0, 0.05) 0%, transparent 100%)',
                            border: '1px solid rgba(0, 255, 0, 0.15)',
                        }}
                    >
                        <h3 className="text-xl md:text-2xl font-mono text-neon-green mb-6 font-bold flex items-center gap-2">
                            <ChevronRight className="text-neon-yellow" size={20} />
                            IntelX helps identify
                        </h3>
                        <ul className="space-y-3">
                            {identifyItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neon-green/5 transition-all group cursor-pointer"
                                    whileHover={{ x: 8 }}
                                >
                                    <span className="text-neon-yellow p-2 rounded-lg bg-neon-yellow/10 group-hover:bg-neon-yellow/20 transition-colors">
                                        <item.icon size={18} />
                                    </span>
                                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                                        {item.text}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Built for */}
                    <motion.div
                        variants={itemVariants}
                        className="p-6 rounded-xl"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 0, 0.05) 0%, transparent 100%)',
                            border: '1px solid rgba(255, 255, 0, 0.15)',
                        }}
                    >
                        <h3 className="text-xl md:text-2xl font-mono text-neon-yellow mb-6 font-bold flex items-center gap-2">
                            <ChevronRight className="text-neon-green" size={20} />
                            Built for
                        </h3>
                        <ul className="space-y-3">
                            {builtForItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neon-yellow/5 transition-all group cursor-pointer"
                                    whileHover={{ x: 8 }}
                                >
                                    <span className="text-neon-green p-2 rounded-lg bg-neon-green/10 group-hover:bg-neon-green/20 transition-colors">
                                        <item.icon size={18} />
                                    </span>
                                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                                        {item.text}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
