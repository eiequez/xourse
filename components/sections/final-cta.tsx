// app/components/FinalCTA.tsx
"use client"

import { motion } from "motion/react"

export default function FinalCTA() {
  return (
    <section className="border-parchment/10 border-t px-6 py-28 lg:px-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-parchment text-4xl leading-tight lg:text-5xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Only XMUM students get in.
          <br />
          <span className="text-brass">That's what keeps it honest.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-parchment/50 mx-auto mt-5 max-w-md text-sm leading-relaxed"
        >
          Sign in with your XMUM email. No outside noise, no fake reviews, just
          the people actually sitting in the room next to you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-9"
        >
          <button className="bg-brass text-ink hover:bg-brass/90 rounded-full px-7 py-3 text-sm font-medium transition">
            Sign in with XMUM email
          </button>
        </motion.div>
      </div>
    </section>
  )
}
