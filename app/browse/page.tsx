import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default async function Browse() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()

  console.log(data)
  console.log(data.user?.user_metadata.avatar_url)

  return (
    <main className="h-screen bg-ink">
      <Navbar />
    </main>
  )
}
