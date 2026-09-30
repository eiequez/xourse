// app/components/ReviewSpotlight.tsx
"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "motion/react"
import { courseHref } from "@/lib/courses"
import { avatarSrc } from "@/lib/profile"
import type { SpotlightReview } from "@/lib/landing-data"
import { Avatar, AvatarImage } from "../ui/avatar"
import { QuoteHighlight } from "../ui/quote-highlight"

export default function ReviewSpotlight({
  reviews,
}: {
  reviews: SpotlightReview[]
}) {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-20%"])

  if (reviews.length === 0) return null

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-night">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="px-6 pt-24 lg:px-24">
          <p className="font-mono text-xs tracking-[0.2em] text-sand uppercase">
            From the reviews
          </p>
        </div>

        <div className="flex flex-1 items-center">
          <motion.div style={{ x }} className="flex gap-6 pl-6 lg:pl-24">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="w-[82vw] shrink-0 rounded-2xl border border-umber/50 p-8 sm:w-[420px]"
              >
                <p className="text-xl leading-relaxed text-bone/90">
                  &ldquo;{r.quote && `${r.quote} `}
                  <QuoteHighlight>{r.highlight}</QuoteHighlight>&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={avatarSrc(r.avatarUrl)} alt="" />
                  </Avatar>
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-medium text-bone">
                      {r.username ? `@${r.username}` : "XMUM student"}
                    </p>
                    <p className="font-mono text-xs text-bone/40">
                      <Link
                        href={courseHref(r.courseCode)}
                        className="hover:text-sand"
                      >
                        {r.courseCode}
                      </Link>{" "}
                      · rated {r.rating}/5
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
