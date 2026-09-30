"use server"

import { redirect } from "next/navigation"

import { EMAIL_DOMAIN_ERROR, isAllowedEmail } from "@/lib/allowed-emails"
import { createClient } from "@/lib/supabase/server"

const PASSWORD_MIN = 8
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect("/browse")
}

export async function signup(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  // The database trigger enforce_email_domain() is the real guard
  if (!isAllowedEmail(email)) {
    return { error: EMAIL_DOMAIN_ERROR }
  }

  if (password.length < PASSWORD_MIN) {
    return { error: `Password must be at least ${PASSWORD_MIN} characters.` }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      // handle_new_user() copies this into profiles.full_name
      data: fullName ? { full_name: fullName } : undefined,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // No session means email confirmation is required; the confirmation link
  // goes through /auth/callback, which then sends the user to /browse.
  redirect(data.session ? "/browse" : "/auth/auth-success")
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(data.url)
}

// Always reports success so the form doesn't reveal which emails have accounts
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { error: "Enter your email." }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // The callback exchanges the code and sends the user to /auth/reset-password
    redirectTo: `${siteUrl}/auth/callback?next=reset`,
  })

  if (error && error.status === 429) {
    return { error: "Too many requests. Wait a minute and try again." }
  }

  return { ok: true }
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (password.length < PASSWORD_MIN) {
    return { error: `Password must be at least ${PASSWORD_MIN} characters.` }
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      error: "This reset link has expired. Request a new one.",
      expired: true,
    }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: error.message }
  }

  redirect("/browse")
}
