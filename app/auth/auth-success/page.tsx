import { MailCheckIcon } from "lucide-react"

export default function AuthSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#12151f] p-6 md:p-10">
      <div className="w-full max-w-sm rounded-lg border border-[#edeae2]/10 bg-[#edeae2]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#c9a227]/15">
          <MailCheckIcon className="size-6 text-[#c9a227]" />
        </div>

        <h1 className="text-xl font-bold text-[#edeae2]">Check your email</h1>

        <p className="mt-2 text-sm text-[#edeae2]/60">
          We&apos;ve sent you a verification link. Please check your inbox and
          click the link to confirm your account before signing in.
        </p>

        <a
          href="/auth/login"
          className="mt-6 inline-block text-sm text-[#c9a227] hover:underline"
        >
          Back to login
        </a>
      </div>
    </div>
  )
}
