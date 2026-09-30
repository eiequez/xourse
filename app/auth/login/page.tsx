import type { Metadata } from "next"

import { EMAIL_DOMAIN_ERROR } from "@/lib/allowed-emails"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Login" }

// Errors the auth callback can send back here
const CALLBACK_ERRORS: Record<string, string> = {
  "email-domain": EMAIL_DOMAIN_ERROR,
  auth_callback_error: "Sign-in failed. Try again.",
}

export default async function LoginPage(props: PageProps<"/auth/login">) {
  const { error } = await props.searchParams
  const initialError =
    typeof error === "string" ? (CALLBACK_ERRORS[error] ?? null) : null

  return (
    <AuthShell>
      <LoginForm initialError={initialError} />
    </AuthShell>
  )
}
