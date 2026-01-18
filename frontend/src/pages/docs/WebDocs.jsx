import { Globe, Shield, Activity, Share2, Info } from 'lucide-react'

const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                <Icon size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="prose prose-invert prose-p:text-foreground/70 prose-headings:text-white max-w-none">
            {children}
        </div>
    </div>
)

export default function WebDocs() {
    return (
        <div className="space-y-8">
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Web Analysis Documentation</h1>
                <p className="text-xl text-foreground/60">
                    Learn how to interpret the comprehensive security and performance metrics provided by the Web Analyzer tool.
                </p>
            </div>

            <Section title="Overview" icon={Globe}>
                <p>
                    The Web Analyzer performs a deep scan of any target URL to gather public information about its infrastructure,
                    security posture, and online presence. It aggregates data from over 20 different endpoints to provide a Hollistic view of the target.
                </p>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg my-4">
                    <div className="flex items-start gap-3">
                        <Info className="text-blue-400 mt-1 shrink-0" size={18} />
                        <div className="text-sm text-blue-300">
                            <strong>Note:</strong> All scans are passive and non-intrusive. The analyzer interacts with the target just like a standard web browser or search engine crawler.
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Security Metrics" icon={Shield}>
                <h3 className="text-xl font-bold text-white mt-4 mb-2">Security Headers</h3>
                <p>
                    We check for critical HTTP security headers that protect against common attacks like XSS, Clickjacking, and MIME-sniffing.
                    A score is calculated based on the presence of headers like:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-foreground/70">
                    <li><code className="bg-white/10 px-1 py-0.5 rounded text-neon-green text-sm">Strict-Transport-Security</code> (HSTS) - Enforces HTTPS</li>
                    <li><code className="bg-white/10 px-1 py-0.5 rounded text-neon-green text-sm">Content-Security-Policy</code> (CSP) - Mitigates XSS</li>
                    <li><code className="bg-white/10 px-1 py-0.5 rounded text-neon-green text-sm">X-Frame-Options</code> - Prevents Clickjacking</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-2">TLS Configuration</h3>
                <p>
                    Ensures the site uses valid SSL/TLS certificates and modern encryption protocols. We inspect the certificate issuer,
                    validity dates, and the specific cipher suites supported by the server.
                </p>
            </Section>

            <Section title="Network Intelligence" icon={Share2}>
                <p>
                    Understanding the path data takes to reach the server can reveal potential bottlenecks or hosting locations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-white mb-2">Trace Route</h4>
                        <p className="text-sm">Visualizes the network hops between our scanner and the target server, identifying ISPs and geographic locations along the path.</p>
                    </div>
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-white mb-2">DNS Records</h4>
                        <p className="text-sm">Retrieves A, AAAA, MX, NS, and TXT records to map the domain's infrastructure and mail servers.</p>
                    </div>
                </div>
            </Section>

            <Section title="Domain Authority" icon={Activity}>
                <p>
                    We track the domain's global ranking and estimated traffic over time. This helps in assessing the legitimacy and popularity of a website.
                    The <strong>Site Map</strong> and <strong>Robots.txt</strong> analysis further reveals how the site is structured and indexed by search engines.
                </p>
            </Section>
        </div>
    )
}
