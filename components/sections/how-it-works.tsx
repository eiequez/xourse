// app/components/HowItWorks.tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

const steps = [
  {
    n: "01",
    title: "Search your elective",
    body: "Look up any course by code or title, before it's locked into your schedule.",
  },
  {
    n: "02",
    title: "Read what actually happened",
    body: "Workload, grading fairness, attendance policy — written by students who sat through it.",
  },
  {
    n: "03",
    title: "Rate it once you're done",
    body: "One honest review keeps the record accurate for the next batch of students.",
  },
]

function StepItem({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof steps)[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const point = index / total
  const opacity = useTransform(
    progress,
    [point - 0.08, point + 0.02],
    [0.25, 1]
  )
  const dotScale = useTransform(progress, [point - 0.05, point], [0.5, 1])

  return (
    <motion.div style={{ opacity }} className="relative">
      {/* <motion.span
        style={{ scale: dotScale }}
        className="absolute top-1.5 -left-[2.65rem] h-3 w-3 rounded-full bg-sand"
      /> */}
      <span className="font-mono text-sm text-sand/70">{step.n}</span>
      <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {step.title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone/50">
        {step.body}
      </p>
    </motion.div>
  )
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.4"],
  })

  return (
    <section
      ref={containerRef}
      className="border-b px-6 py-20 lg:px-24 lg:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-12 font-mono text-xs tracking-[0.2em] text-sand uppercase lg:mb-16">
          How it works
        </p>
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute top-1 left-0 h-full w-px bg-bone/10" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute top-1 left-0 h-full w-px origin-top bg-sand"
          />
          <div className="flex flex-col gap-12 lg:gap-16">
            {steps.map((step, i) => (
              <StepItem
                key={step.n}
                step={step}
                index={i}
                total={steps.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
