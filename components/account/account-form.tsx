"use client"

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { Loader2Icon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { updateProfile } from "@/app/account/actions"
import {
  AVATAR_MAX_BYTES,
  AVATAR_TYPES,
  avatarSrc,
  BIO_MAX,
  FULL_NAME_MAX,
  USERNAME_HINT,
  validateProfile,
  type ProfileField,
} from "@/lib/profile"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { FormError } from "@/components/auth/form-error"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"

const input = "border-umber/60 bg-bone/3 text-bone placeholder:text-bone/35"

type AccountFormProps = {
  userId: string
  email: string
  profile: {
    username: string
    fullName: string
    avatarUrl: string | null
    bio: string
  }
}

export function AccountForm({ userId, email, profile }: AccountFormProps) {
  const [username, setUsername] = useState(profile.username)
  const [fullName, setFullName] = useState(profile.fullName)
  const [bio, setBio] = useState(profile.bio)
  // null = default avatar; a File is uploaded when the form is saved
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<
    Partial<Record<ProfileField | "avatar", string>>
  >({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const fileInput = useRef<HTMLInputElement>(null)

  // Free the object URL used for the local preview
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const avatarChanged = file !== null || avatarUrl !== profile.avatarUrl
  const shownAvatar = preview ?? avatarSrc(avatarUrl)

  function pickFile(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    e.target.value = ""
    if (!picked) return
    if (!AVATAR_TYPES.includes(picked.type)) {
      setErrors((x) => ({ ...x, avatar: "Use a JPG, PNG or WebP image." }))
      return
    }
    if (picked.size > AVATAR_MAX_BYTES) {
      setErrors((x) => ({ ...x, avatar: "Images must be 2 MB or smaller." }))
      return
    }
    setErrors((x) => ({ ...x, avatar: undefined }))
    setFile(picked)
    setPreview(URL.createObjectURL(picked))
  }

  function resetToDefault() {
    setFile(null)
    setPreview(null)
    setAvatarUrl(null)
    setErrors((x) => ({ ...x, avatar: undefined }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const input = { username, fullName, bio }
    const clientErrors = validateProfile(input)
    if (Object.keys(clientErrors).length > 0) return setErrors(clientErrors)

    startTransition(async () => {
      const supabase = createClient()
      let nextAvatar: string | null | undefined = avatarChanged
        ? avatarUrl
        : undefined
      let uploadedPath: string | null = null

      if (file) {
        const ext =
          file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1]
        uploadedPath = `${userId}/${Date.now()}.${ext}`
        const { error } = await supabase.storage
          .from("avatars")
          .upload(uploadedPath, file, { contentType: file.type })
        if (error) {
          setErrors((x) => ({
            ...x,
            avatar: "The photo could not be uploaded. Try again.",
          }))
          return
        }
        nextAvatar = supabase.storage.from("avatars").getPublicUrl(uploadedPath)
          .data.publicUrl
      }

      const result = await updateProfile({ ...input, avatarUrl: nextAvatar })

      if (!result.ok) {
        // Don't leave an unused upload behind
        if (uploadedPath)
          await supabase.storage.from("avatars").remove([uploadedPath])
        setErrors(result.fieldErrors ?? {})
        setFormError(result.error ?? null)
        return
      }

      // Remove older photos in this user's folder once the new one is saved
      if (avatarChanged) {
        const { data: files } = await supabase.storage
          .from("avatars")
          .list(userId)
        const stale = (files ?? [])
          .map((f) => `${userId}/${f.name}`)
          .filter((path) => path !== uploadedPath)
        if (stale.length > 0)
          await supabase.storage.from("avatars").remove(stale)
      }

      if (nextAvatar !== undefined) setAvatarUrl(nextAvatar)
      setFile(null)
      setPreview(null)
      setErrors({})
      toast.success("Profile updated")
    })
  }

  return (
    <Card className="mt-8 gap-0 py-0">
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="px-6 py-6 sm:px-8">
          <FieldGroup className="gap-7">
            <FormError message={formError} />

            <Field>
              <FieldLabel className="text-bone">Photo</FieldLabel>
              <div className="flex items-center gap-5">
                <Avatar className="size-20">
                  <AvatarImage src={shownAvatar} alt="" />
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInput.current?.click()}
                      className="border-umber/70 text-bone hover:bg-bone/6"
                    >
                      <UploadIcon />
                      Upload photo
                    </Button>
                    {(avatarUrl || preview) && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetToDefault}
                        className="text-bone/70 hover:bg-bone/6 hover:text-bone"
                      >
                        Use default
                      </Button>
                    )}
                  </div>
                  <FieldDescription className="text-bone/45">
                    JPG, PNG or WebP, up to 2 MB.
                  </FieldDescription>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept={AVATAR_TYPES.join(",")}
                  onChange={pickFile}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden
                />
              </div>
              <FieldError>{errors.avatar}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="fullName" className="text-bone">
                Name{" "}
                <span className="font-normal text-bone/45">(optional)</span>
              </FieldLabel>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  setErrors((x) => ({ ...x, fullName: undefined }))
                }}
                maxLength={FULL_NAME_MAX + 10}
                autoComplete="name"
                className={input}
              />
              <FieldError>{errors.fullName}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="username" className="text-bone">
                Username
              </FieldLabel>
              <InputGroup
                className={cn(
                  "border-umber/60 bg-bone/3 dark:bg-bone/3",
                  errors.username && "border-signal/60"
                )}
              >
                <InputGroupAddon className="pl-3 text-bone/45">
                  @
                </InputGroupAddon>
                <InputGroupInput
                  id="username"
                  value={username}
                  onChange={(e) => {
                    // Usernames are stored lowercase without spaces
                    setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                    setErrors((x) => ({ ...x, username: undefined }))
                  }}
                  maxLength={20}
                  autoComplete="username"
                  spellCheck={false}
                  aria-invalid={Boolean(errors.username)}
                  className="text-bone"
                />
              </InputGroup>
              {errors.username ? (
                <FieldError>{errors.username}</FieldError>
              ) : (
                <FieldDescription className="text-bone/45">
                  {USERNAME_HINT}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="bio" className="text-bone">
                Bio <span className="font-normal text-bone/45">(optional)</span>
              </FieldLabel>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value)
                  setErrors((x) => ({ ...x, bio: undefined }))
                }}
                rows={3}
                placeholder="Year, programme, what you're into..."
                aria-invalid={Boolean(errors.bio)}
                className={cn(input, "min-h-20")}
              />
              <div className="flex items-start justify-between gap-4">
                <FieldError>{errors.bio}</FieldError>
                <span
                  className={cn(
                    "ml-auto shrink-0 text-xs tabular-nums",
                    bio.trim().length > BIO_MAX ? "text-signal" : "text-bone/45"
                  )}
                >
                  {bio.trim().length} / {BIO_MAX}
                </span>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-bone">
                Email
              </FieldLabel>
              <Input
                id="email"
                value={email}
                readOnly
                disabled
                className={input}
              />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-end border-t border-umber/50 px-6 py-4 sm:px-8">
          <Button
            type="submit"
            disabled={pending}
            className="bg-wine text-white hover:bg-wine/90"
          >
            {pending && <Loader2Icon className="animate-spin" />}
            Update profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
