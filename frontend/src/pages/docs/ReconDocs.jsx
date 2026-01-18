import { Radar, Search, UserCheck, Crosshair } from 'lucide-react'

const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-yellow/10 text-neon-yellow">
                <Icon size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="prose prose-invert prose-p:text-foreground/70 prose-headings:text-white max-w-none">
            {children}
        </div>
    </div>
)

export default function ReconDocs() {
    return (
        <div className="space-y-8">
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Recon Analysis</h1>
                <p className="text-xl text-foreground/60">
                    Open Source Intelligence (OSINT) gathering for digital footprint investigation.
                </p>
            </div>

            <Section title="What is Recon?" icon={Radar}>
                <p>
                    Reconnaissance is the first phase of any security assessment. The Recon Analyzer aggregates public data to build a profile of a target,
                    identifying potential attack vectors or information leaks.
                </p>
            </Section>

            <Section title="Capabilities" icon={Search}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="p-6 bg-[#0a0e17] rounded-xl border border-white/10">
                        <UserCheck className="text-neon-yellow mb-4" size={32} />
                        <h3 className="font-bold text-white mb-2">Username Search</h3>
                        <p className="text-sm text-foreground/60">
                            Check for the existence of a username across hundreds of social media platforms and websites.
                        </p>
                    </div>
                    <div className="p-6 bg-[#0a0e17] rounded-xl border border-white/10">
                        <Crosshair className="text-neon-yellow mb-4" size={32} />
                        <h3 className="font-bold text-white mb-2">Subdomain Enum</h3>
                        <p className="text-sm text-foreground/60">
                            Discover hidden subdomains that might be exposing internal services or dev environments.
                        </p>
                    </div>
                </div>
            </Section>

            <Section title="Ethics & Usage" icon={Search}>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="font-bold text-yellow-500 mb-2">Legal Disclaimer</h4>
                    <p className="text-sm text-yellow-200/80">
                        This tool interacts only with public data sources. It does not perform active scanning or exploits.
                        However, always ensure you have permission before aggregating data on individuals or organizations.
                    </p>
                </div>
            </Section>
        </div>
    )
}
