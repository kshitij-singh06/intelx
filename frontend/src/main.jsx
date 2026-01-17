import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Layouts & Pages
import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardLayout'
import OverviewPage from './pages/dashboard/OverviewPage'
import WebAnalysisPage from './pages/dashboard/WebAnalysisPage'
import MalwareAnalysisPage from './pages/dashboard/MalwareAnalysisPage'

const ReconAnalysisPage = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neon-yellow/10 flex items-center justify-center text-neon-yellow">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Recon Analysis</h2>
        <p className="text-foreground/60 max-w-md">OSINT gathering tools are currently under development. Check back for updates on username and breach analysis.</p>
    </div>
)

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<OverviewPage />} />
                    <Route path="web" element={<WebAnalysisPage />} />
                    <Route path="malware" element={<MalwareAnalysisPage />} />
                    <Route path="recon" element={<ReconAnalysisPage />} />
                    <Route path="settings" element={<div className="text-white p-8">Settings Panel (Placeholder)</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
