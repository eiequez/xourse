// app/components/LedgerMarquee.tsx
import Link from "next/link"

import { courseHref, ratingTextClass } from "@/lib/courses"
import type { LedgerEntry } from "@/lib/landing-data"
import { cn } from "@/lib/utils"
import { Marquee } from "../ui/marquee"

export default function LedgerMarquee({ entries }: { entries: LedgerEntry[] }) {
  if (entries.length === 0) return null

  return (
    <div className="border-y border-umber/50 bg-night py-4">
      <Marquee pauseOnHover className="[--duration:35s]">
        {entries.map((e) => (
          <Link
            key={e.code}
            href={courseHref(e.code)}
            className="mx-6 flex items-center gap-2 font-mono text-xs text-bone/50 transition-colors hover:text-bone"
          >
            <span>{e.code}</span>
            {e.rating === null ? (
              <span className="text-bone/30">new</span>
            ) : (
              <span className={cn(ratingTextClass(e.rating))}>
                {e.rating.toFixed(1)}
              </span>
            )}
            <span className="text-bone/20">·</span>
          </Link>
        ))}
      </Marquee>
    </div>
  )
}
