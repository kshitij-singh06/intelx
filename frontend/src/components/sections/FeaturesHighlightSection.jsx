import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Github, Rocket, Code } from 'lucide-react'

const features = [
    // Column 1
    ['Archive History', 'Block List Check', 'Carbon Footprint', 'Cookies', 'DNS Server', 'DNS Records','Reverse Engineering'],
    // Column 2
    ['DNSSEC', 'Site Features', 'Firewall Types', 'Get IP Address', 'Headers', 'HSTS', 'HTTP Security'],
    // Column 3
    ['Linked Pages', 'Mail Config', 'Open Ports', 'Quality Check', 'Global Rank', 'Redirects', 'Robots.txt'],
    // Column 4
    ['Screenshot', 'Security.txt', 'Sitemap', 'Social Tags', 'SSL Certificate', 'Uptime Status', 'Tech Stack'],
    // Column 5
    ['Known Threats', 'TLS Version', 'Trace Route', 'TXT Records', 'Whois Lookup'],
]

export function FeaturesHighlightSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    }

    return (
        <section ref={ref} className="py-24 px-4 relative overflow-hidden bg-[#0a0a0a]">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a0a] to-background" />

            <motion.div
                className="max-w-6xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {/* Header */}
                <motion.div className="text-center mb-12" variants={itemVariants}>
                    <p className="text-lg md:text-xl text-foreground/80">
                        With over <span className="text-neon-green font-bold">30 supported checks</span> you can view and analyse key
                    </p>
                    <p className="text-lg md:text-xl text-foreground/80">
                        information in an instant
                    </p>
                </motion.div>

                {/* Separator line */}
                <motion.div
                    className="w-16 h-0.5 bg-foreground/20 mx-auto mb-12"
                    variants={itemVariants}
                />

                {/* Features grid - 5 columns */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-3 mb-12"
                    variants={containerVariants}
                >
                    {features.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-3">
                            {column.map((feature, featureIndex) => (
                                <motion.div
                                    key={featureIndex}
                                    variants={itemVariants}
                                    className="flex items-center gap-2 group cursor-pointer"
                                    whileHover={{ x: 4 }}
                                >
                                    <Check
                                        size={16}
                                        className="text-neon-green flex-shrink-0 group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-foreground/80 text-sm group-hover:text-foreground transition-colors">
                                        {feature}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ))}

                    {/* "+ More" item in last column */}
                    {/* <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-2 cursor-pointer group lg:col-start-5"
                        whileHover={{ x: 4 }}
                    >
                        <span className="text-neon-green font-bold text-sm group-hover:text-neon-yellow transition-colors">
                            + More
                        </span>
                    </motion.div> */}
                </motion.div>
            </motion.div>
        </section>
    )
}
