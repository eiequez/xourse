import type { ReactNode } from "react"
import Link from "next/link"

import { DotPattern } from "@/components/ui/dot-pattern"

// Two-column auth layout from shadcn login-02 / signup-02: form on the left,
// cover image on the right (lg and up). The cover sits on a brand gradient,
// so the panel still looks finished until public/auth-cover.jpg exists.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh bg-night lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Link
            href="/"
            className="rounded-md font-heading text-xl font-semibold tracking-tight text-white transition-colors outline-none hover:text-sand focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Xourse
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-linear-to-br from-night via-wine/40 to-wine lg:block">
        <DotPattern
          cr={1}
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] text-sand/40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[url(/auth-cover.jpg)] bg-cover bg-center"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-night/90 to-transparent p-10 pt-24">
          <p className="max-w-sm font-heading text-3xl font-semibold tracking-tight text-white">
            Know before you enroll.
          </p>
          <p className="mt-2 text-sm text-bone/70">
            Honest reviews of XMUM electives from students who took them.
          </p>
        </div>
      </div>
    </div>
  )
}
