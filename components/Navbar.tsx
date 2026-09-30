import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { UserMenu } from "@/components/user-menu"

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null }

  return (
    <header className="sticky top-0 z-40 border-b border-umber/50 bg-night/80 px-6 backdrop-blur-md lg:px-24">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="rounded-md font-heading text-xl font-semibold tracking-tight text-white transition-colors outline-none hover:text-sand focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Xourse
        </Link>

        {user && (
          <UserMenu
            name={profile?.full_name ?? profile?.username ?? null}
            email={user.email ?? null}
            avatarUrl={profile?.avatar_url ?? null}
          />
        )}
      </div>
    </header>
  )
}
