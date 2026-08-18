import HeroSection from "@/components/sections/hero-section"
import HowItWorks from "@/components/sections/how-it-works"
import TrendingElectives from "@/components/sections/trending-electives"
import ReviewSpotlight from "@/components/sections/review-spotlight"
import FinalCTA from "@/components/sections/final-cta"
import Footer from "@/components/Footer"
import LedgerMarquee from "@/components/sections/ledger-marqee"
import GradeReveal from "@/components/sections/grade-reveal"

export default function Home() {
  return (
    <main className="bg-ink">
      <HeroSection />
      <LedgerMarquee />
      <HowItWorks />
      <GradeReveal />
      <TrendingElectives />
      <ReviewSpotlight />
      <FinalCTA />
      <Footer />
    </main>
  )
}
