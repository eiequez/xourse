import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { AccountForm } from "@/components/account/account-form"
import { BackButton } from "@/components/back-button"

export const metadata: Metadata = { title: "Account" }

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url, bio")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <div className="px-6 pt-10 pb-24 lg:px-24 lg:pt-14">
      <div className="mx-auto max-w-2xl">
        <BackButton />
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-white">
          Account
        </h1>
        <p className="mt-2 text-bone/60">
          Your photo, name, username and bio appear next to your reviews.
        </p>

        <AccountForm
          userId={user.id}
          email={user.email ?? ""}
          profile={{
            username: profile?.username ?? "",
            fullName: profile?.full_name ?? "",
            avatarUrl: profile?.avatar_url ?? null,
            bio: profile?.bio ?? "",
          }}
        />
      </div>
    </div>
  )
}
