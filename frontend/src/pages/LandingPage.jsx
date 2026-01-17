import { IntroductionSection } from '../components/sections/IntroductionSection'
import { HeroSection } from '../components/sections/HeroSection'
import { ToolsOverviewSection } from '../components/sections/ToolsOverviewSection'
import { FeaturesHighlightSection } from '../components/sections/FeaturesHighlightSection'
import { OpenSourceSection } from '../components/sections/OpenSourceSection'
import { CTASection } from '../components/sections/CTASection'

export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <IntroductionSection />
            <ToolsOverviewSection />
            <FeaturesHighlightSection />
            <OpenSourceSection />
            <CTASection />
            <footer className="py-8 text-center text-foreground/40 text-sm border-t border-foreground/10 bg-[#05070a]">
                <p>© 2024 IntelX Platform. All rights reserved.</p>
            </footer>
        </>
    )
}
