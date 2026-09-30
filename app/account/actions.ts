"use server"

import { revalidatePath } from "next/cache"

import {
  normalizeUsername,
  validateProfile,
  type ProfileField,
  type ProfileInput,
} from "@/lib/profile"
import { createClient } from "@/lib/supabase/server"

export type UpdateProfileResult =
  | { ok: true }
  | {
      ok: false
      error?: string
      fieldErrors?: Partial<Record<ProfileField, string>>
    }

const TAKEN = "That username is taken. Try another one."

export async function updateProfile(
  input: ProfileInput & {
    // undefined = keep the current photo, null = use the default avatar
    avatarUrl?: string | null
  }
): Promise<UpdateProfileResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sign in to update your profile." }

  const fieldErrors = validateProfile(input)
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  // Only accept photos uploaded to this user's own folder in the avatars bucket
  if (input.avatarUrl) {
    const ownFolder = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`
    if (!input.avatarUrl.startsWith(ownFolder)) {
      return {
        ok: false,
        error: "That photo could not be used. Upload it again.",
      }
    }
  }

  const username = normalizeUsername(input.username)

  // Check the name is free before writing anything
  const { data: taken, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle()
  if (lookupError) {
    console.error("updateProfile lookup failed", lookupError)
    return { ok: false, error: "Could not check that username. Try again." }
  }
  if (taken) return { ok: false, fieldErrors: { username: TAKEN } }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: input.fullName.trim() || null,
      bio: input.bio.trim() || null,
      ...(input.avatarUrl !== undefined && { avatar_url: input.avatarUrl }),
    })
    .eq("id", user.id)

  if (error) {
    // Someone took the name between the check and the update
    if (error.code === "23505") {
      return { ok: false, fieldErrors: { username: TAKEN } }
    }
    console.error("updateProfile failed", error)
    return { ok: false, error: "Your profile could not be saved. Try again." }
  }

  // The navbar avatar and review names appear on every signed-in page
  revalidatePath("/", "layout")
  return { ok: true }
}
