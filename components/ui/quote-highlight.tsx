// app/components/QuoteHighlight.tsx
"use client"

import { motion } from "motion/react"

export function QuoteHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline">
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute inset-x-0 bottom-0.5 h-[0.5em] origin-left bg-brass/25"
      />
      <span className="relative text-parchment">{children}</span>
    </span>
  )
}
