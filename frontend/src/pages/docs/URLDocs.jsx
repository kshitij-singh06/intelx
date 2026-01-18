import { Link, Globe, AlertTriangle, Zap, Shield, AlertCircle, Gauge, BookOpen } from 'lucide-react'

const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Icon size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="prose prose-invert prose-p:text-foreground/70 prose-headings:text-white max-w-none">
            {children}
        </div>
    </div>
)

export default function URLDocs() {
    return (
        <div className="space-y-8">
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-bold text-white mb-4">URL Analyzer Documentation</h1>
                <p className="text-xl text-foreground/60">
                    Complete guide to analyzing URLs, tracing redirect chains, and assessing phishing and malware risks using IntelX URL Analyzer.
                </p>
            </div>

            <Section title="What is URL Analysis?" icon={Globe}>
                <p>
                    URL Analysis is a security assessment tool designed to analyze URLs and uncover hidden threats. It performs comprehensive inspection of:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-foreground/70">
                    <li><strong>Redirect Chains:</strong> Trace all hops a URL takes before reaching final destination</li>
                    <li><strong>HTTP Status Codes:</strong> Identify errors, redirects, and authentication requirements</li>
                    <li><strong>HTTPS Status:</strong> Verify SSL/TLS encryption at each hop</li>
                    <li><strong>Domain Reputation:</strong> Check for phishing, malware, and spam</li>
                    <li><strong>Content Analysis:</strong> AI-powered threat assessment of final destination</li>
                    <li><strong>Phishing Indicators:</strong> Detect common phishing tactics and suspicious patterns</li>
                </ul>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg my-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-400 mt-1 shrink-0" size={18} />
                        <div className="text-sm text-blue-300">
                            <strong>Note:</strong> URL analysis is entirely passive. The analyzer does not download files, execute code, or interact with malicious content. It safely queries threat intelligence databases and inspects HTTP headers without engaging with the actual website content beyond headers.
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Core Features" icon={Shield}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">Redirect Chain Tracing</h3>
                <p>
                    One of the most dangerous phishing tactics is using URL shorteners and redirects to hide the true destination. URL Analyzer traces every hop:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li><strong>Initial URL:</strong> The URL you submitted for analysis</li>
                    <li><strong>Intermediate Redirects:</strong> Each 301/302/307/308 hop along the way</li>
                    <li><strong>Final Destination:</strong> The actual webpage being loaded</li>
                    <li><strong>HTTP Status Codes:</strong> Response code at each step (200, 301, 404, 403, etc.)</li>
                    <li><strong>Location Headers:</strong> Where each redirect points to</li>
                    <li><strong>HTTPS Status:</strong> Whether each hop uses encrypted HTTPS</li>
                </ul>

                <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10 my-4">
                    <h4 className="font-bold text-neon-yellow mb-3">Example Redirect Chain</h4>
                    <div className="space-y-2 font-mono text-xs text-foreground/70">
                        <div>1. bit.ly/ab12cd (HTTPS 301)</div>
                        <div className="ml-4">↓ redirects to →</div>
                        <div>2. example.com/promo (HTTPS 302)</div>
                        <div className="ml-4">↓ redirects to →</div>
                        <div>3. phishing-site.net/login (HTTP 200) ⚠️ RED FLAG</div>
                    </div>
                    <p className="text-sm text-red-300 mt-3">The redirect chain reveals the true destination is a phishing site!</p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">HTTP Status Code Analysis</h3>
                <p>
                    HTTP status codes reveal important information about server responses:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="p-3 bg-[#0a0e17] rounded-lg border border-white/10">
                        <p className="text-sm font-bold text-neon-green">2xx (Success)</p>
                        <p className="text-xs text-foreground/60 mt-1">200 OK, 201 Created, 204 No Content - Request successful</p>
                    </div>
                    <div className="p-3 bg-[#0a0e17] rounded-lg border border-white/10">
                        <p className="text-sm font-bold text-neon-green">3xx (Redirect)</p>
                        <p className="text-xs text-foreground/60 mt-1">301/302/307/308 - Follow to another URL</p>
                    </div>
                    <div className="p-3 bg-[#0a0e17] rounded-lg border border-white/10">
                        <p className="text-sm font-bold text-neon-yellow">4xx (Client Error)</p>
                        <p className="text-xs text-foreground/60 mt-1">404 Not Found, 403 Forbidden - Server won't respond</p>
                    </div>
                    <div className="p-3 bg-[#0a0e17] rounded-lg border border-white/10">
                        <p className="text-sm font-bold text-red-400">5xx (Server Error)</p>
                        <p className="text-xs text-foreground/60 mt-1">500/503 - Server error or unreachable</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">HTTPS/TLS Verification</h3>
                <p>
                    Checking HTTPS status at each redirect is critical. A phishing site will often:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li>Start with legitimate HTTPS (to bypass initial suspicion)</li>
                    <li>Redirect to HTTP (unencrypted) at the final phishing site</li>
                    <li>Use self-signed or wildcard certificates</li>
                    <li>Have mismatched domain names in certificate</li>
                </ul>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg my-4">
                    <h4 className="font-bold text-red-400 mb-2">🚨 Red Flag</h4>
                    <p className="text-sm text-red-200">If a redirect chain goes from HTTPS → HTTP, this is highly suspicious and often indicates phishing.</p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Domain Reputation Checking</h3>
                <p>
                    Each URL is checked against threat intelligence databases:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li><strong>Google Safe Browsing:</strong> Malware, phishing, and unwanted software detection</li>
                    <li><strong>VirusTotal:</strong> Multi-vendor malware scanning results</li>
                    <li><strong>Reputation Scoring:</strong> Overall safety assessment from multiple sources</li>
                    <li><strong>Phishing Database:</strong> Known phishing URLs and patterns</li>
                    <li><strong>Spam Blacklists:</strong> Check if domain/IP is on spam blocklists</li>
                </ul>
            </Section>

            <Section title="Risk Assessment" icon={AlertTriangle}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">Risk Levels</h3>
                <div className="space-y-3 mt-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <h4 className="font-bold text-green-400 mb-1">🟢 LOW RISK</h4>
                        <p className="text-sm text-green-200">URL is clean, HTTPS throughout, good reputation, no redirects or legitimate redirects.</p>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <h4 className="font-bold text-yellow-400 mb-1">🟡 MEDIUM RISK</h4>
                        <p className="text-sm text-yellow-200">Some redirects present, minor reputation issues, or mixed HTTPS/HTTP. Proceed with caution.</p>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <h4 className="font-bold text-red-400 mb-1">🔴 HIGH RISK</h4>
                        <p className="text-sm text-red-200">Known phishing/malware, HTTPS → HTTP redirect, blacklist status, or suspicious domain. DO NOT CLICK.</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Common Phishing Patterns</h3>
                <div className="space-y-3">
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-neon-yellow mb-2">⚠️ URL Shortener Redirect</h4>
                        <p className="text-sm text-foreground/70">bit.ly, tinyurl, or custom shorteners hide the true destination. Always expand before clicking.</p>
                    </div>
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-neon-yellow mb-2">⚠️ HTTPS → HTTP Downgrade</h4>
                        <p className="text-sm text-foreground/70">Secure site redirecting to unencrypted site. Classic phishing indicator.</p>
                    </div>
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-neon-yellow mb-2">⚠️ Domain Typosquatting</h4>
                        <p className="text-sm text-foreground/70">URLs that look legitimate but have subtle misspellings (gogle.com vs google.com).</p>
                    </div>
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-neon-yellow mb-2">⚠️ Suspicious Subdomains</h4>
                        <p className="text-sm text-foreground/70">bank-verify.legitimate-domain.com looks legitimate but is actually attacker-controlled.</p>
                    </div>
                    <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                        <h4 className="font-bold text-neon-yellow mb-2">⚠️ Long Redirect Chain</h4>
                        <p className="text-sm text-foreground/70">More than 2-3 redirects is suspicious. Attackers use multiple hops to evade detection.</p>
                    </div>
                </div>
            </Section>

            <Section title="AI-Powered Threat Analysis" icon={Zap}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">AI Summary Generation</h3>
                <p>
                    After analyzing the redirect chain and reputation, IntelX can generate an AI-powered threat summary:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li><strong>Threat Assessment:</strong> AI analyzes all findings and provides verdict</li>
                    <li><strong>Risk Factors:</strong> Specific indicators that influenced the risk score</li>
                    <li><strong>Recommendations:</strong> Actions to take based on the analysis</li>
                    <li><strong>Domain History:</strong> Previous reports or incidents with the domain</li>
                    <li><strong>Alternative Sources:</strong> Safer ways to reach legitimate services</li>
                </ul>

                <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10 my-4">
                    <h4 className="font-bold text-neon-yellow mb-3">Example AI Analysis</h4>
                    <p className="text-sm text-foreground/70 mb-2">
                        "URL redirects from legitimate social media platform to unknown domain with poor reputation. Certificate mismatch detected. This is a high-confidence phishing attempt targeting social media users. Do not enter credentials."
                    </p>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">How to Use AI Summary</h3>
                <ol className="list-decimal pl-5 space-y-2 mt-2 text-foreground/70">
                    <li>Click "Generate AI Summary" after initial analysis completes</li>
                    <li>Read the threat assessment carefully</li>
                    <li>Review the specific risk factors mentioned</li>
                    <li>Follow the recommendations provided</li>
                    <li>If legitimate, the AI will suggest safe alternatives (official websites, contact info)</li>
                </ol>
            </Section>

            <Section title="Common Use Cases" icon={BookOpen}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">Email Security</h3>
                <p>
                    Suspicious email links are the #1 phishing vector. Analyze URLs before clicking:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li>URLs from unexpected senders</li>
                    <li>Shortened URLs from external emails</li>
                    <li>Unusual links in invoices or payment requests</li>
                    <li>Urgent messages with unverified links</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Social Media Protection</h3>
                <p>
                    Social media is rife with malicious URLs. Before clicking:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li>Shortened URLs in DMs or comments</li>
                    <li>Links to "free prizes" or giveaways</li>
                    <li>URL shorteners from unfamiliar accounts</li>
                    <li>Trending links that seem suspicious</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Incident Response</h3>
                <p>
                    During security incidents, rapidly analyze multiple URLs:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li>URLs found in user browser history</li>
                    <li>Links in compromised emails or messages</li>
                    <li>Suspicious downloads or attachments</li>
                    <li>Command and control (C2) URLs</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">CTF & Security Research</h3>
                <p>
                    Analyze intentionally malicious or obfuscated URLs safely:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li>CTF challenges with hidden redirect chains</li>
                    <li>Obfuscated URLs in security research</li>
                    <li>Proof-of-concept phishing pages</li>
                    <li>Malware distribution URLs (safely, without downloading)</li>
                </ul>
            </Section>

            <Section title="Understanding Results" icon={Gauge}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">Redirect Chain Display</h3>
                <p>
                    Results show each hop in the redirect chain with key information:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li><strong>Step Number:</strong> Order of the redirect (1st, 2nd, 3rd, etc.)</li>
                    <li><strong>URL/Domain:</strong> The full URL at this step</li>
                    <li><strong>HTTP Status:</strong> Response code (200, 301, 302, etc.)</li>
                    <li><strong>HTTPS Status:</strong> Shows lock icon if encrypted, warning if not</li>
                    <li><strong>Domain Info:</strong> Reputation and threat level indicator</li>
                    <li><strong>Time Taken:</strong> How long this hop took to respond</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Risk Score Breakdown</h3>
                <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10 my-4">
                    <h4 className="font-bold text-neon-yellow mb-3">Factors Contributing to Risk:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/70">
                        <li>Blacklist status (highest weight)</li>
                        <li>HTTPS → HTTP downgrade (high weight)</li>
                        <li>Suspicious redirect patterns (medium weight)</li>
                        <li>Domain reputation (medium weight)</li>
                        <li>Certificate issues (medium weight)</li>
                        <li>URL shorteners or unusual paths (low weight)</li>
                    </ul>
                </div>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">What to Do If URL Is Risky</h3>
                <div className="space-y-3">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <h4 className="font-bold text-red-400 mb-2">HIGH RISK - DO NOT CLICK</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-red-200">
                            <li>Delete the email or message</li>
                            <li>Report to sender's company if impersonation suspected</li>
                            <li>Report to phishing authorities (MailGuard, Anti-Phishing Working Group)</li>
                            <li>If clicked, change passwords immediately</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <h4 className="font-bold text-yellow-400 mb-2">MEDIUM RISK - PROCEED WITH CAUTION</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-200">
                            <li>Contact sender through alternate means to verify legitimacy</li>
                            <li>If trusted, ensure browser security (updated browser, VPN)</li>
                            <li>Do not enter sensitive information (credentials, payment info)</li>
                            <li>Monitor accounts for suspicious activity</li>
                        </ul>
                    </div>
                </div>
            </Section>

            <Section title="Best Practices" icon={Shield}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">URL Safety Tips</h3>
                <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                    <li><strong>Hover Before Clicking:</strong> On most platforms, hover to see where a link actually goes</li>
                    <li><strong>Verify Sender:</strong> Check email address and domain carefully (not just display name)</li>
                    <li><strong>Expand Shortened URLs:</strong> Use URL analyzer to see true destination before clicking</li>
                    <li><strong>Check for HTTPS:</strong> Legitimate sites use encrypted HTTPS, especially for logins</li>
                    <li><strong>Use Bookmarks:</strong> For important sites, bookmark the real URL instead of clicking links</li>
                    <li><strong>Enable 2FA:</strong> Even if phishing succeeds, two-factor authentication protects accounts</li>
                    <li><strong>Keep Software Updated:</strong> Browser and OS updates patch security vulnerabilities</li>
                    <li><strong>Use Password Manager:</strong> Won't auto-fill passwords on phishing sites with wrong domains</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Red Flags to Watch For</h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/70">
                    <li>Unexpected urgency ("Act now!" "Confirm immediately!")</li>
                    <li>Requests for personal information or credentials</li>
                    <li>Grammar and spelling errors in messages</li>
                    <li>Generic greetings ("Dear User" instead of your name)</li>
                    <li>Suspicious sender addresses</li>
                    <li>Threats or scare tactics</li>
                    <li>Too-good-to-be-true offers</li>
                </ul>
            </Section>

            <Section title="API & Technical Details" icon={AlertCircle}>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">Analysis Process</h3>
                <ol className="list-decimal pl-5 space-y-2 mt-2 text-foreground/70">
                    <li><strong>URL Validation:</strong> Check if URL is valid format</li>
                    <li><strong>Domain Resolution:</strong> Lookup domain IP address</li>
                    <li><strong>Initial Request:</strong> Send HEAD request to get headers without downloading</li>
                    <li><strong>Redirect Tracking:</strong> Follow each 3xx response to next URL</li>
                    <li><strong>TLS Check:</strong> Verify HTTPS certificate at each hop</li>
                    <li><strong>Reputation Lookup:</strong> Query threat intelligence databases</li>
                    <li><strong>Final Classification:</strong> Calculate risk score based on all factors</li>
                    <li><strong>AI Analysis:</strong> Optional AI summary of findings (if requested)</li>
                </ol>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Performance & Timeout</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li>Typical analysis completes in 3-10 seconds</li>
                    <li>Each hop has a 5-second timeout</li>
                    <li>Maximum 10 redirects are followed (prevents infinite loops)</li>
                    <li>If a URL times out, it's flagged as suspicious</li>
                    <li>Results are cached for 12 hours to reduce redundant analysis</li>
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Safety Guarantees</h3>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg my-4">
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-200">
                        <li>✓ No files are downloaded or executed</li>
                        <li>✓ No JavaScript or plugins are executed</li>
                        <li>✓ Only HTTP headers are retrieved (no page content)</li>
                        <li>✓ Analysis is completely passive</li>
                        <li>✓ Safe to analyze even known malicious URLs</li>
                    </ul>
                </div>
            </Section>
        </div>
    )
}
