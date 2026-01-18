import { Eye, FileCode, Lock, Layers } from 'lucide-react'

const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Icon size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="prose prose-invert prose-p:text-foreground/70 prose-headings:text-white max-w-none">
            {children}
        </div>
    </div>
)

export default function StegDocs() {
    return (
        <div className="space-y-8">
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Steganography Analysis</h1>
                <p className="text-xl text-foreground/60">
                    Recover hidden data from inside images, audio files, and documents using advanced forensic techniques.
                </p>
            </div>

            <Section title="Overview" icon={Eye}>
                <p>
                    Steganography is the art of hiding information within other non-secret text or data.
                    The IntelX Steg Analyzer runs uploaded files through a battery of forensic tools to detect and extract these hidden payloads.
                </p>
                <p className="mt-4">
                    Common use cases include digital forensics, CTF challenges, and malware analysis where payloads are hidden in images.
                </p>
            </Section>

            <Section title="Supported Tools" icon={Layers}>
                <p>
                    We automatically run the following industry-standard tools on every upload:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {[
                        { name: 'Steghide', desc: 'Embeds and extracts data from BMP, JPG, WAV and AU files.' },
                        { name: 'Zsteg', desc: 'Detects hidden data in LSB steganography for PNG and BMP files.' },
                        { name: 'ExifTool', desc: 'Reads, writes and edits meta information in a wide variety of files.' },
                        { name: 'Binwalk', desc: 'Fast, easy to use tool for analyzing, reverse engineering, and extracting firmware images.' },
                        { name: 'Strings', desc: 'Finds printable strings in object or other binary files.' },
                        { name: 'Foremost', desc: 'Recover files based on their headers, footers, and internal data structures.' }
                    ].map((tool, i) => (
                        <div key={i} className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                            <h4 className="font-bold text-neon-green mb-1">{tool.name}</h4>
                            <p className="text-sm text-foreground/60">{tool.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Using Passwords" icon={Lock}>
                <p>
                    Some steganography tools (like Steghide) require a passphrase to extract hidden data.
                </p>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg my-4">
                    <p className="text-sm text-purple-200">
                        If you suspect the file is password-protected, enter the password in the optional <strong>"Decryption Password"</strong> field
                        before starting the analysis.
                    </p>
                </div>
            </Section>

            <Section title="File Types" icon={FileCode}>
                <p>
                    The analyzer supports a wide range of formats, but is most effective on:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/70">
                    <li><strong>Images:</strong> JPG, JPEG, PNG, BMP, GIF</li>
                    <li><strong>Audio:</strong> WAV, MP3</li>
                    <li><strong>Text/Other:</strong> PDF, TXT</li>
                </ul>
            </Section>
        </div>
    )
}
