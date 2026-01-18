import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Rocket, FileText, Zap } from 'lucide-react'

export function CTASection() {
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
            transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    }

    return (
        <section ref={ref} className="py-32 px-4 relative overflow-hidden">
            {/* Rich animated background */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#0d1235] to-[#0a0e27]" />

                {/* Animated glow orbs */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green/20 rounded-full blur-[150px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-neon-yellow/15 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />

                {/* Cyber grid overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                    <defs>
                        <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00ff00" strokeWidth="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cta-grid)" />
                </svg>

                {/* Floating particles */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-neon-green rounded-full"
                        style={{
                            left: `${10 + (i * 6)}%`,
                            top: `${20 + (i * 5) % 60}%`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 4 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Top border with animated glow */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.5), transparent)',
                }}
                animate={{
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <motion.div
                className="max-w-4xl mx-auto text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {/* Decorative element */}
                <motion.div variants={itemVariants} className="mb-8">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5"
                        animate={{ boxShadow: ['0 0 20px rgba(0, 255, 0, 0.2)', '0 0 40px rgba(0, 255, 0, 0.4)', '0 0 20px rgba(0, 255, 0, 0.2)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Zap className="w-4 h-4 text-neon-yellow" />
                        <span className="text-neon-green font-mono text-sm">Ready to Deploy</span>
                    </motion.div>
                </motion.div>

                <motion.h2
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground font-mono leading-tight"
                >
                    Ready to see what the
                </motion.h2>

                <motion.h2
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-12 font-mono"
                    style={{
                        background: 'linear-gradient(135deg, #00ff00 0%, #ffff00 50%, #00ff00 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 80px rgba(0, 255, 0, 0.5)',
                    }}
                >
                    internet reveals?
                </motion.h2>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/dashboard">
                            <Button variant="primary" className="relative overflow-hidden group text-lg px-12 py-6">
                                {/* Shimmer effect */}
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                />
                                {/* Pulse effect */}
                                <motion.span
                                    className="absolute inset-0 bg-neon-green/30"
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="relative flex items-center gap-3">
                                    <Rocket size={22} />
                                    Launch IntelX
                                </span>
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/docs">
                            <Button variant="outline" className="text-lg px-12 py-6 flex items-center gap-3">
                                <FileText size={22} />
                                View Documentation
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Animated scan line */}
                <motion.div variants={itemVariants} className="relative">
                    <motion.div
                        className="h-px w-full bg-gradient-to-r from-transparent via-neon-green to-transparent"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Terminal-style text */}
                    <motion.p
                        className="mt-8 font-mono text-foreground/40 text-sm"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <span className="text-neon-green">$</span> intelx --version 1.0.0 | Built with ♥ for the security community
                    </motion.p>
                </motion.div>
            </motion.div>
        </section>
    )
}
