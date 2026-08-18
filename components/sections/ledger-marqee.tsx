// app/components/LedgerMarquee.tsx
import { Marquee } from "../ui/marquee"
const entries = [
  { code: "BUS3013", rating: "4.8" },
  { code: "CS2044", rating: "3.2" },
  { code: "PSY1120", rating: "4.5" },
  { code: "ECO2210", rating: "2.9" },
  { code: "MKT2101", rating: "4.1" },
  { code: "PHY1001", rating: "3.6" },
]

export default function LedgerMarquee() {
  return (
    <div className="border-y border-parchment/10 bg-ink py-4">
      <Marquee pauseOnHover className="[--duration:35s]">
        {entries.map((e) => (
          <div
            key={e.code}
            className="mx-6 flex items-center gap-2 font-mono text-xs text-parchment/50"
          >
            <span>{e.code}</span>
            <span className="text-brass">{e.rating}</span>
            <span className="text-parchment/20">·</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
