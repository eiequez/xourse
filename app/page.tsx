import HeroSection from "@/components/sections/hero-section"
import HowItWorks from "@/components/sections/how-it-works"
import TrendingElectives from "@/components/sections/trending-electives"
import ReviewSpotlight from "@/components/sections/review-spotlight"
import FinalCTA from "@/components/sections/final-cta"
import Footer from "@/components/Footer"
import LedgerMarquee from "@/components/sections/ledger-marqee"
import GradeReveal from "@/components/sections/grade-reveal"
import { getLandingData } from "@/lib/landing-data"

// The landing is pre-rendered and rebuilt in the background at most hourly.
// Review changes also rebuild it right away (revalidatePath("/") in
// app/browse/[id]/actions.ts), so visitors never wait on the database.
export const revalidate = 3600

export default async function Home() {
  const { trending, ledger, spotlight } = await getLandingData()

  return (
    // overflow-x-clip (not hidden) so the sticky sections keep working
    <main className="overflow-x-clip bg-night">
      <HeroSection />
      <LedgerMarquee entries={ledger} />
      <HowItWorks />
      <GradeReveal />
      <TrendingElectives courses={trending} />
      <ReviewSpotlight reviews={spotlight} />
      <FinalCTA />
      <Footer />
    </main>
  )
}
