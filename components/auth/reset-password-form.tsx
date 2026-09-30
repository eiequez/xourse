"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import { Loader2Icon } from "lucide-react"

import { updatePassword } from "@/app/auth/actions"
import { FormError } from "@/components/auth/form-error"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const input = "border-umber/60 bg-bone/3 text-bone placeholder:text-bone/35"

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) {
        setError(result.error)
        setExpired(Boolean(result.expired))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
            Set a new password
          </h1>
          <p className="text-sm text-balance text-bone/60">
            Choose a new password for your account.
          </p>
        </div>

        <FormError message={error} />
        {expired && (
          <Link
            href="/auth/forgot-password"
            className="-mt-3 text-sm text-sand underline-offset-4 hover:underline"
          >
            Request a new reset link
          </Link>
        )}

        <Field>
          <FieldLabel htmlFor="password" className="text-bone">
            New password
          </FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={input}
          />
          <FieldDescription className="text-bone/50">
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword" className="text-bone">
            Confirm new password
          </FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className={input}
          />
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={pending}
            className="bg-wine text-white hover:bg-wine/90"
          >
            {pending && <Loader2Icon className="animate-spin" />}
            Update password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
