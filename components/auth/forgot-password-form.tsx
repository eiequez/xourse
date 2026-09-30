"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import { Loader2Icon, MailCheckIcon } from "lucide-react"

import { requestPasswordReset } from "@/app/auth/actions"
import { FormError } from "@/components/auth/form-error"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await requestPasswordReset(formData)
      if (result.error) setError(result.error)
      else setSentTo(String(formData.get("email")))
    })
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-sand/15">
          <MailCheckIcon className="size-6 text-sand" />
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
          Check your email
        </h1>
        <p className="text-sm text-balance text-bone/60">
          If an account exists for {sentTo}, we sent a link to reset your
          password.
        </p>
        <Link
          href="/auth/login"
          className="mt-2 text-sm text-sand underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="text-sm text-balance text-bone/60">
            Enter your email and we&apos;ll send you a link to set a new
            password.
          </p>
        </div>

        <FormError message={error} />

        <Field>
          <FieldLabel htmlFor="email" className="text-bone">
            Email
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            required
            className="border-umber/60 bg-bone/3 text-bone placeholder:text-bone/35"
          />
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={pending}
            className="bg-wine text-white hover:bg-wine/90"
          >
            {pending && <Loader2Icon className="animate-spin" />}
            Send reset link
          </Button>
          <FieldDescription className="text-center text-bone/55">
            Remembered it?{" "}
            <Link
              href="/auth/login"
              className="text-sand underline underline-offset-4"
            >
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
