// app/components/FinalCTA.tsx
"use client"

import { motion } from "motion/react"
import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="border-t border-umber/50 px-6 py-28 lg:px-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl leading-tight font-semibold tracking-tight text-white lg:text-5xl"
        >
          For XMUM students
          <br />
          <span className="text-sand">
            Who doesn&apos;t want to waste time on useless courses.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-bone/50"
        >
          no fake reviews, just the people actually sitting in the room next to
          you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-9"
        >
          <Link href="/auth/signup">
            <button className="rounded-full bg-wine px-7 py-3 text-sm font-medium text-white transition hover:bg-wine/90">
              Sign up
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
