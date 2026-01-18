import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileImage, ShieldAlert, ImageIcon, Terminal, Activity, Eye, Download, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Lock, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const API_BASE = 'http://localhost:5002/api/steg-analyzer'

const TerminalLine = ({ text, delay = 0, color = 'text-foreground/70' }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.3 }}
        className={`font-mono text-xs ${color}`}
    >
        <span className="text-foreground/30 mr-2">$</span>
        {text}
    </motion.div>
)

// Tool result card component
const ToolResultCard = ({ toolName, result }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const isOk = result.status === 'ok'
    const hasOutput = result.output || result.images || result.download

    // Format tool name for display
    const displayName = toolName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    const renderOutput = () => {
        if (result.error) {
            return <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap">{result.error}</pre>
        }

        if (result.images) {
            return (
                <div className="space-y-4">
                    {Object.entries(result.images).map(([category, urls]) => (
                        <div key={category}>
                            <div className="text-xs text-foreground/60 mb-2 font-semibold">{category}</div>
                            <div className="grid grid-cols-4 gap-2">
                                {urls.slice(0, 8).map((url, i) => (
                                    <a
                                        key={i}
                                        href={`${API_BASE}${url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="aspect-square bg-black/50 rounded border border-white/10 overflow-hidden hover:border-neon-green/50 transition-colors"
                                    >
                                        <img
                                            src={`${API_BASE}${url}`}
                                            alt={`${category} ${i}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                    </a>
                                ))}
                            </div>
                            {urls.length > 8 && (
                                <div className="text-xs text-foreground/40 mt-2">+{urls.length - 8} more images</div>
                            )}
                        </div>
                    ))}
                </div>
            )
        }

        if (typeof result.output === 'object' && !Array.isArray(result.output)) {
            // Object output like exiftool
            return (
                <div className="space-y-1">
                    {Object.entries(result.output).map(([key, value]) => (
                        <div key={key} className="flex text-xs font-mono">
                            <span className="text-foreground/50 w-48 flex-shrink-0">{key}:</span>
                            <span className="text-gray-300">{String(value)}</span>
                        </div>
                    ))}
                </div>
            )
        }

        if (Array.isArray(result.output)) {
            return (
                <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                    {result.output.join('\n')}
                </pre>
            )
        }

        if (typeof result.output === 'string') {
            return (
                <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                    {result.output}
                </pre>
            )
        }

        return <span className="text-foreground/40 text-xs">No output data</span>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {isOk ? (
                        <CheckCircle size={16} className="text-green-500" />
                    ) : (
                        <XCircle size={16} className="text-red-500" />
                    )}
                    <span className="font-mono text-sm text-white">{displayName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${isOk ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {result.status.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {result.download && (
                        <a
                            href={`${API_BASE}${result.download}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-neon-green hover:underline flex items-center gap-1"
                        >
                            <Download size={12} /> Download
                        </a>
                    )}
                    {isExpanded ? <ChevronUp size={16} className="text-foreground/40" /> : <ChevronDown size={16} className="text-foreground/40" />}
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && hasOutput && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/5"
                    >
                        <div className="p-4 bg-black/30">
                            {renderOutput()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default function StegAnalysisPage() {
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [status, setStatus] = useState(null) // 'uploading', 'polling', 'completed', 'error'
    const [results, setResults] = useState(null)
    const [logs, setLogs] = useState([])
    const [error, setError] = useState(null)
    const [submissionHash, setSubmissionHash] = useState(null)
    const fileInputRef = useRef(null)

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'pdf']

    const validateFile = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase()
        if (!allowedExtensions.includes(extension)) {
            setError(`Invalid file type. Allowed: ${allowedExtensions.join(', ').toUpperCase()}`)
            return false
        }
        setError(null)
        return true
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (validateFile(selectedFile.name)) {
                setFile({
                    name: selectedFile.name,
                    size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
                    rawFile: selectedFile
                })
                setResults(null)
                setError(null)
            }
        }
    }

    const handleFileDrop = (e) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            if (validateFile(droppedFile.name)) {
                setFile({
                    name: droppedFile.name,
                    size: (droppedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
                    rawFile: droppedFile
                })
                setResults(null)
                setError(null)
            }
        }
    }

    const addLog = (text, color = 'text-foreground/70') => {
        setLogs(prev => [...prev, { text, color }])
    }

    const clearFile = () => {
        setFile(null)
        setPassword('')
        setResults(null)
        setError(null)
        setLogs([])
        setStatus(null)
        setSubmissionHash(null)
    }

    const pollStatus = async (hash) => {
        const maxAttempts = 120 // 2 minutes max
        let attempts = 0

        while (attempts < maxAttempts) {
            try {
                const res = await fetch(`${API_BASE}/status/${hash}`)
                if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`)

                const data = await res.json()

                if (data.status === 'completed') {
                    return true
                } else if (data.status === 'error' || data.status === 'failed') {
                    throw new Error(data.error || 'Analysis failed')
                }

                // Still running, wait and poll again
                addLog(`[*] Analysis in progress... (${attempts + 1}s)`)
                await new Promise(resolve => setTimeout(resolve, 1000))
                attempts++
            } catch (err) {
                throw err
            }
        }

        throw new Error('Analysis timed out after 2 minutes')
    }

    const handleScan = async () => {
        if (!file) return

        setAnalyzing(true)
        setLogs([])
        setResults(null)
        setError(null)
        setStatus('uploading')

        try {
            // Step 1: Upload file
            addLog(`[+] Initializing steganography analysis...`)
            addLog(`[+] Uploading ${file.name}...`)

            const formData = new FormData()
            formData.append('image', file.rawFile)
            if (password) {
                formData.append('password', password)
            }

            const uploadRes = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData
            })

            if (!uploadRes.ok) {
                throw new Error(`Upload failed: ${uploadRes.statusText}`)
            }

            const uploadData = await uploadRes.json()
            const hash = uploadData.submission_hash
            setSubmissionHash(hash)

            addLog(`[+] File uploaded successfully`, 'text-neon-green')
            addLog(`[*] Submission hash: ${hash.substring(0, 16)}...`)

            // Step 2: Poll status
            setStatus('polling')
            addLog(`[*] Starting analysis pipeline...`)
            addLog(`[*] Running: binwalk, strings, exiftool, steghide, zsteg...`)

            await pollStatus(hash)

            addLog(`[+] Analysis complete!`, 'text-neon-green')

            // Step 3: Get results
            addLog(`[*] Fetching results...`)

            const resultRes = await fetch(`${API_BASE}/result/${hash}`)
            if (!resultRes.ok) {
                throw new Error(`Failed to fetch results: ${resultRes.statusText}`)
            }

            const resultData = await resultRes.json()
            setResults(resultData.results)
            setStatus('completed')
            addLog(`[+] Results loaded successfully`, 'text-neon-green')

        } catch (err) {
            addLog(`[!] Error: ${err.message}`, 'text-red-500')
            setError(err.message)
            setStatus('error')
        } finally {
            setAnalyzing(false)
        }
    }

    // Calculate stats from results
    const getStats = () => {
        if (!results) return { ok: 0, error: 0, total: 0 }
        const entries = Object.entries(results)
        const ok = entries.filter(([_, r]) => r.status === 'ok').length
        const error = entries.filter(([_, r]) => r.status === 'error').length
        return { ok, error, total: entries.length }
    }

    const stats = getStats()

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Eye className="text-neon-green" /> Steg Analyzer
                    </h2>
                    <p className="text-foreground/60">Steganography Detection & Analysis</p>
                </div>
                <div className="px-3 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono flex items-center gap-2">
                    <ImageIcon size={14} /> HIDDEN DATA DETECTION
                </div>
            </div>

            {/* Dynamic Layout Container */}
            <div className={analyzing || results ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "max-w-xl mx-auto mt-20"}>

                {/* Left Column: Upload & Control */}
                <div className={analyzing || results ? "lg:col-span-4 space-y-6" : "space-y-6"}>

                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,.pdf" />

                    {/* Upload Zone */}
                    <motion.div
                        layout
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden
                            ${file ? 'border-neon-green/50 bg-neon-green/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
                            ${analyzing ? 'pointer-events-none opacity-50' : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => !file && fileInputRef.current?.click()}
                    >
                        {file ? (
                            <>
                                <FileImage className="w-12 h-12 text-neon-green mb-4" />
                                <div className="font-mono text-white mb-1">{file.name}</div>
                                <div className="text-xs text-foreground/40">{file.size}</div>
                                <Button variant="outline" className="mt-4 text-xs h-8" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                                    Remove
                                </Button>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-foreground/20 mb-4" />
                                <div className="text-foreground/60 mb-2">Drop image to analyze</div>
                                <div className="text-xs text-foreground/30 font-mono mb-4">OR CLICK TO UPLOAD</div>
                                <div className="mt-6 text-[10px] text-foreground/40 font-mono border border-foreground/10 px-2 py-1 rounded">
                                    SUPPORTED: {allowedExtensions.map(e => e.toUpperCase()).join(', ')}
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Password Field */}
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <label className="text-xs text-foreground/60 font-mono flex items-center gap-2">
                                <Lock size={12} /> Password (optional)
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="For steghide/openstego extraction"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-foreground/30 font-mono text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                            />
                        </motion.div>
                    )}

                    {/* Error Display */}
                    {error && !analyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-start gap-3"
                        >
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <Button variant="primary" className="w-full h-12 text-lg" disabled={!file || analyzing} onClick={handleScan}>
                        {analyzing ? <span className="flex items-center gap-2"><Activity className="animate-spin" /> Analyzing...</span> : 'Analyze Image'}
                    </Button>

                    {/* Terminal Log */}
                    {(analyzing || results) && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-black p-4 font-mono h-[300px] overflow-y-auto custom-scrollbar relative">
                            <div className="absolute top-2 right-4 text-xs text-foreground/20 flex items-center gap-1"><Terminal size={12} /> STEG ANALYSIS LOG</div>
                            <div className="space-y-1 mt-4">
                                {logs.map((log, i) => <TerminalLine key={i} text={log.text} color={log.color} />)}
                                {analyzing && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-4 bg-neon-green mt-1 inline-block" />}
                            </div>
                        </motion.div>
                    )}

                    {/* Analysis Stats */}
                    {results && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Eye size={14} className="text-purple-400" /> Analysis Summary
                                </h4>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-500">{stats.ok}</div>
                                        <div className="text-[10px] text-foreground/40 uppercase">Successful</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-500">{stats.error}</div>
                                        <div className="text-[10px] text-foreground/40 uppercase">Failed/N/A</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                                        <div className="text-[10px] text-foreground/40 uppercase">Total Tools</div>
                                    </div>
                                </div>
                                {submissionHash && (
                                    <div className="text-xs font-mono text-foreground/40 border-t border-white/5 pt-3">
                                        <div className="flex justify-between">
                                            <span>Hash:</span>
                                            <span className="text-white">{submissionHash.substring(0, 16)}...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Results */}
                {(analyzing || results) && (
                    <div className="lg:col-span-8 space-y-4">
                        {!results ? (
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-foreground/20 animate-pulse min-h-[600px]">
                                <Eye className="w-24 h-24 mb-4 opacity-20" />
                                <p>Analyzing image for hidden data...</p>
                                <p className="text-xs mt-2">Running steganography detection tools</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white">Tool Results</h3>
                                    <span className="text-xs text-foreground/40 font-mono">{stats.total} tools executed</span>
                                </div>

                                {/* Group results by status - successful first */}
                                {Object.entries(results)
                                    .sort(([, a], [, b]) => {
                                        if (a.status === 'ok' && b.status !== 'ok') return -1
                                        if (a.status !== 'ok' && b.status === 'ok') return 1
                                        return 0
                                    })
                                    .map(([toolName, result]) => (
                                        <ToolResultCard key={toolName} toolName={toolName} result={result} />
                                    ))
                                }
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
