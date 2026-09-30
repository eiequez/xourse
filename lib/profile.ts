// Shown when a profile has no photo (e.g. email sign-ups)
export const DEFAULT_AVATAR = "/default_pfpf.png"

export function avatarSrc(url: string | null | undefined) {
  return url || DEFAULT_AVATAR
}

// Full name when set, otherwise the username
export function displayName(
  fullName: string | null | undefined,
  username: string | null | undefined
) {
  return fullName?.trim() || username?.trim() || "XMUM student"
}

// Must match the profiles_username_format check in the database
export const USERNAME_RULE = /^[a-z0-9_.]{3,20}$/
export const USERNAME_HINT =
  "3–20 characters: lowercase letters, numbers, underscores and dots."
export const FULL_NAME_MAX = 60
export const BIO_MAX = 160

export type ProfileInput = {
  username: string
  fullName: string
  bio: string
}

export type ProfileField = keyof ProfileInput

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase()
}

export function validateProfile(input: ProfileInput) {
  const errors: Partial<Record<ProfileField, string>> = {}
  if (!USERNAME_RULE.test(normalizeUsername(input.username)))
    errors.username = USERNAME_HINT
  if (input.fullName.trim().length > FULL_NAME_MAX)
    errors.fullName = `Keep your name under ${FULL_NAME_MAX} characters.`
  if (input.bio.trim().length > BIO_MAX)
    errors.bio = `Keep your bio under ${BIO_MAX} characters.`
  return errors
}

// Avatar uploads: must match the avatars bucket limits
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
