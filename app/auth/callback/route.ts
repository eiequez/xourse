import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // Only the password-reset email sets this; everything else lands on /browse
  const isPasswordReset = searchParams.get("next") === "reset"

  // Supabase sends errors back as query params. The enforce_email_domain()
  // trigger makes new sign-ups from other domains fail with this message.
  const errorDescription = searchParams.get("error_description") ?? ""
  if (errorDescription.includes("Database error saving new user")) {
    return NextResponse.redirect(`${origin}/auth/login?error=email-domain`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(
        `${origin}${isPasswordReset ? "/auth/reset-password" : "/browse"}`
      )
    }
  }

  // Auth failed — send them back to login with an error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
