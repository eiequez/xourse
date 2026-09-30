// app/components/TrendingElectives.tsx — same as before, with the fixed badge prop
"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { TiltCard } from "@/components/unlumen-ui/tilt-card"
import { GlowingBadge } from "@/components/unlumen-ui/glowing-badge"
import { ScrambleText } from "@/components/unlumen-ui/scramble-text"
import { courseHref, plural, ratingTextClass } from "@/lib/courses"
import type { TrendingCourse } from "@/lib/landing-data"
import { cn } from "@/lib/utils"

// Desktop columns follow the number of cards (at most 5)
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
}

export default function TrendingElectives({
  courses,
}: {
  courses: TrendingCourse[]
}) {
  if (courses.length === 0) return null

  return (
    <section className="border-umber/50 px-6 py-24 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-sand uppercase">
              This semester
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white lg:text-4xl">
              Trending electives
            </h2>
          </div>
          <Link
            href="/browse"
            className="hidden text-sm text-bone/60 underline decoration-bone/30 underline-offset-4 hover:text-bone sm:block"
          >
            View all electives
          </Link>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2",
            LG_COLS[courses.length]
          )}
        >
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
                className="flex h-full flex-col justify-between rounded-2xl border border-umber/50 bg-bone/[0.03] p-5"
              >
                <Link href={courseHref(c.code)} className="group">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-wide">
                      {c.code}
                    </span>
                    <GlowingBadge className={ratingTextClass(c.rating)}>
                      <ScrambleText
                        text={c.rating.toFixed(1)}
                        className="font-mono text-xs font-bold text-black"
                      />
                    </GlowingBadge>
                  </div>
                  <h3 className="mt-3 text-lg text-bone group-hover:text-sand">
                    {c.name}
                  </h3>
                  <div className="mt-6 flex items-center justify-between text-xs text-bone/40">
                    <span>{c.tag}</span>
                    <span>{plural(c.reviews, "review")}</span>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
