import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "./database.types"

// Anonymous client for public, cacheable reads (e.g. the landing page).
// Unlike lib/supabase/server.ts it never touches cookies(), so pages using
// it can stay statically rendered and revalidate on a timer.
export const createPublicClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
