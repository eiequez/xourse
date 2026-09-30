// app/components/GradeReveal.tsx
"use client"

import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react"
import { DotPattern } from "../ui/dot-pattern"
import { FlickeringGrid } from "../ui/flickering-grid"

export default function GradeReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const rating = useTransform(scrollYProgress, [0.15, 0.75], [0, 4.3])
  const flickerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.7])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.92])

  const [display, setDisplay] = useState("0.0")
  useMotionValueEvent(rating, "change", (latest) =>
    setDisplay(latest.toFixed(1))
  )

  return (
    <section ref={ref} className="relative h-[220vh] bg-night">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <motion.div
          style={{ opacity: flickerOpacity }}
          className="pointer-events-none absolute inset-0"
        >
          {/* <DotPattern cr={1} /> */}
          <FlickeringGrid
            squareSize={6}
            gridGap={10}
            color="#A9927D"
            flickerChance={0.2}
            className="[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
          />
        </motion.div>

        <p className="relative mb-4 font-mono text-xs tracking-[0.2em] text-sand uppercase">
          Across every reviewed elective
        </p>

        <motion.div style={{ scale }} className="relative flex items-baseline">
          <span className="font-heading text-[20vw] leading-none font-semibold tracking-tight text-white lg:text-[9rem]">
            {display}
          </span>
          <span className="ml-3 text-xl text-bone/40 lg:text-2xl">
            / 5.0 average
          </span>
        </motion.div>
      </div>
    </section>
  )
}
