import type { Metadata } from "next"
import Link from "next/link"
import { MailCheckIcon } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Check your email" }

export default function AuthSuccessPage() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-sand/15">
          <MailCheckIcon className="size-6 text-sand" />
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
          Check your email
        </h1>
        <p className="text-sm text-balance text-bone/60">
          We&apos;ve sent you a verification link. Click it to confirm your
          account, then sign in.
        </p>
        <Link
          href="/auth/login"
          className="mt-2 text-sm text-sand underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </AuthShell>
  )
}
