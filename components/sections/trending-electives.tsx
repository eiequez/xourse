// app/components/TrendingElectives.tsx
"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Tilt } from "@/components/unlumen-ui/tilt"
import { ClippedCircle } from "@/components/unlumen-ui/clipped-circle"
import { GlowingBadge } from "@/components/unlumen-ui/glowing-badge"
import { ScrambleText } from "@/components/unlumen-ui/scramble-text"
import { courseHref, plural, ratingTextClass } from "@/lib/courses"
import type { TrendingCourse } from "@/lib/landing-data"
import { cn } from "@/lib/utils"

// One column on phones, two from sm. Wide screens put the cards in one row:
// 3 across from lg, but 4 across only from xl (at lg they'd be ~200px wide)
const WIDE_COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "xl:grid-cols-4",
}

const viewAllClass =
  "text-sm text-bone/60 underline decoration-bone/30 underline-offset-4 hover:text-bone"

export default function TrendingElectives({
  courses,
}: {
  courses: TrendingCourse[]
}) {
  if (courses.length === 0) return null

  return (
    <section className="px-6 py-20 lg:px-24 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
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
            className={cn(viewAllClass, "hidden shrink-0 sm:block")}
          >
            View all electives
          </Link>
        </div>

        <div
          className={cn(
            "grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2",
            WIDE_COLS[courses.length]
          )}
        >
          {courses.map((c, i) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-full"
            >
              <Link
                href={courseHref(c.code)}
                className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-sand/60"
              >
                <Tilt
                  rotationFactor={11}
                  className="relative flex h-full min-h-40 flex-col overflow-hidden rounded-2xl border border-umber/50 bg-bone/3 p-5 transition-all duration-400 ease-out hover:scale-105 hover:shadow-lg sm:min-h-48 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-xs tracking-wide text-bone/70">
                      {c.code}
                    </span>
                    <GlowingBadge className={ratingTextClass(c.rating)}>
                      <ScrambleText
                        text={c.rating.toFixed(1)}
                        className="font-mono text-xs font-bold text-black"
                      />
                    </GlowingBadge>
                  </div>
                  <h3 className="mt-3 line-clamp-3 text-lg leading-snug text-bone group-hover:text-sand">
                    {c.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs text-bone/40">
                    <span className="truncate">{c.tag}</span>
                    <span className="shrink-0">
                      {plural(c.reviews, "review")}
                    </span>
                  </div>
                  <ClippedCircle circleClassName="bg-white" circleSize={800} />
                </Tilt>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* The header link is hidden on phones, so repeat it under the cards */}
        <Link
          href="/browse"
          className={cn(viewAllClass, "mt-8 inline-block sm:hidden")}
        >
          View all electives
        </Link>
      </div>
    </section>
  )
}
