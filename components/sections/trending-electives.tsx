// app/components/TrendingElectives.tsx — same as before, with the fixed badge prop
"use client"

import { motion } from "motion/react"
import { TiltCard } from "@/components/unlumen-ui/tilt-card"
import { GlowingBadge } from "@/components/unlumen-ui/glowing-badge"
import { ScrambleText } from "@/components/unlumen-ui/scramble-text"

type Course = {
  code: string
  title: string
  rating: number
  reviews: number
  tag: string
}

const courses: Course[] = [
  {
    code: "BUS3013",
    title: "Consumer Behaviour",
    rating: 4.8,
    reviews: 62,
    tag: "Light workload",
  },
  {
    code: "PSY1120",
    title: "Social Psychology",
    rating: 4.5,
    reviews: 41,
    tag: "Great lecturer",
  },
  {
    code: "CS2044",
    title: "Intro to AI",
    rating: 3.2,
    reviews: 88,
    tag: "Heavy workload",
  },
  {
    code: "ECO2210",
    title: "Behavioural Economics",
    rating: 2.9,
    reviews: 27,
    tag: "Tough grading",
  },
]

function ratingTextClass(rating: number) {
  if (rating >= 4.0) return "text-brass"
  if (rating >= 3.0) return "text-sage"
  return "text-signal"
}

export default function TrendingElectives() {
  return (
    <section className="border-parchment/10 px-6 py-24 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brass uppercase">
              This semester
            </p>
            <h2
              className="text-3xl text-parchment lg:text-4xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Trending electives
            </h2>
          </div>
          <a
            href="/electives"
            className="hidden text-sm text-parchment/60 underline decoration-parchment/30 underline-offset-4 hover:text-parchment sm:block"
          >
            View all electives
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c, i) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard
                title=""
                className="flex h-full flex-col justify-between rounded-2xl border border-parchment/10 bg-parchment/[0.03] p-5"
              >
                <a
                  href={`/electives/${c.code.toLowerCase()}`}
                  className="group"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-wide text-parchment/40">
                      {c.code}
                    </span>
                    <GlowingBadge className={ratingTextClass(c.rating)}>
                      <ScrambleText
                        text={c.rating.toFixed(1)}
                        className="font-mono text-xs font-bold"
                      />
                    </GlowingBadge>
                  </div>
                  <h3 className="mt-3 text-lg text-parchment group-hover:text-brass">
                    {c.title}
                  </h3>
                  <div className="mt-6 flex items-center justify-between text-xs text-parchment/40">
                    <span>{c.tag}</span>
                    <span>{c.reviews} reviews</span>
                  </div>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
