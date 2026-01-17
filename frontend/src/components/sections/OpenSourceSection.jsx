import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Github, Heart, Star, GitFork, ExternalLink } from 'lucide-react'

export function OpenSourceSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    }

    return (
        <section ref={ref} className="py-28 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#0d1235] to-[#0a0e27]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

            {/* Animated code lines background */}
            <div className="absolute inset-0 overflow-hidden opacity-5">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute left-0 right-0 font-mono text-xs text-neon-green whitespace-nowrap"
                        style={{ top: `${i * 12}%` }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 20 + i * 2, repeat: Infinity, ease: 'linear' }}
                    >
                        {`const security = new IntelX(); await security.analyze(target); // MIT Licensed `.repeat(10)}
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="max-w-4xl mx-auto text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {/* GitHub icon with glow */}
                <motion.div variants={itemVariants} className="mb-8">
                    <motion.div
                        className="inline-flex p-6 rounded-2xl bg-foreground/5 border border-foreground/10"
                        whileHover={{
                            scale: 1.1,
                            boxShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Github className="w-12 h-12 text-foreground" />
                    </motion.div>
                </motion.div>

                <motion.span
                    variants={itemVariants}
                    className="inline-block text-foreground/60 text-xs font-mono tracking-[0.3em] uppercase mb-4 px-4 py-2 border border-foreground/20 rounded-full bg-foreground/5"
                >
                    Community Driven
                </motion.span>

                <motion.h2
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground font-mono"
                >
                    Open Source &{' '}
                    <span className="text-neon-green" style={{ textShadow: '0 0 40px rgba(0, 255, 0, 0.4)' }}>
                        Trust
                    </span>
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-foreground/70 mb-12 leading-relaxed max-w-2xl mx-auto"
                >
                    IntelX embraces transparency and community-driven security tooling.
                    Parts of the platform are open-source and MIT licensed.
                    Source code and self-hosting documentation are available on GitHub.
                </motion.p>

                {/* GitHub stats cards */}
                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { icon: Star, label: 'Star on GitHub', value: 'Show Support' },
                        { icon: GitFork, label: 'Fork & Contribute', value: 'Join Us' },
                        { icon: ExternalLink, label: 'Documentation', value: 'Learn More' },
                    ].map((item, i) => (
                        <motion.button
                            key={i}
                            className="flex items-center gap-3 px-6 py-4 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 hover:border-neon-green/30 transition-all group"
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <item.icon size={20} className="text-neon-green group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                                <div className="text-foreground/60 text-xs">{item.label}</div>
                                <div className="text-foreground font-mono text-sm">{item.value}</div>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Support callout */}
                <motion.div
                    variants={itemVariants}
                    className="relative p-8 rounded-2xl overflow-hidden inline-block"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.1) 0%, rgba(255, 255, 0, 0.02) 100%)',
                        border: '1px solid rgba(255, 255, 0, 0.3)',
                    }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 50px rgba(255, 255, 0, 0.15)',
                    }}
                >
                    {/* Animated heart */}
                    <motion.div
                        className="absolute top-4 right-4"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Heart className="w-6 h-6 text-red-400 fill-red-400" />
                    </motion.div>

                    <p className="text-neon-yellow font-mono font-bold text-lg md:text-xl max-w-lg">
                        "If you find IntelX useful, consider supporting its development."
                    </p>
                </motion.div>
            </motion.div>
        </section>
    )
}
