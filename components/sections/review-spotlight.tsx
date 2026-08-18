// app/components/ReviewSpotlight.tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { QuoteHighlight } from "../ui/quote-highlight"

const reviews = [
  {
    initials: "MK",
    course: "BUS3013",
    rating: "4.8",
    quote: "The lecturer actually replies to emails within a day, and",
    highlight:
      "the group project weighting is lighter than the syllabus makes it sound.",
  },
  {
    initials: "AR",
    course: "CS2044",
    rating: "3.2",
    quote: "Doable if you already know Python.",
    highlight:
      "Budget real time for the assignments — they're not optional practice.",
  },
  {
    initials: "TL",
    course: "PSY1120",
    rating: "4.5",
    quote: "Best elective I took at XMUM, no contest.",
    highlight:
      "The final is entirely open-note, which nobody tells you going in.",
  },
  {
    initials: "SN",
    course: "ECO2210",
    rating: "2.9",
    quote: "Interesting content, brutal grading curve.",
    highlight: "Go in expecting a B unless you're already strong at stats.",
  },
]

export default function ReviewSpotlight() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-20%"])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="px-6 pt-24 lg:px-24">
          <p className="font-mono text-xs tracking-[0.2em] text-brass uppercase">
            From the reviews
          </p>
        </div>

        <div className="flex flex-1 items-center">
          <motion.div style={{ x }} className="flex gap-6 pl-6 lg:pl-24">
            {reviews.map((r) => (
              <div
                key={r.course}
                className="w-[82vw] shrink-0 rounded-2xl border border-parchment/10 p-8 sm:w-[420px]"
              >
                <p
                  className="text-xl leading-relaxed text-parchment/90"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "italic",
                  }}
                >
                  "{r.quote} <QuoteHighlight>{r.highlight}</QuoteHighlight>"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brass/15 font-mono text-xs font-bold text-brass">
                    {r.initials}
                  </div>
                  <div className="text-sm">
                    <p className="text-parchment/70">Verified XMUM student</p>
                    <p className="font-mono text-xs text-parchment/40">
                      {r.course} · rated {r.rating}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
