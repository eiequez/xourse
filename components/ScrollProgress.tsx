// app/components/ScrollProgress.tsx
"use client"

import { motion, useScroll, useSpring } from "motion/react"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-sand"
    />
  )
}
