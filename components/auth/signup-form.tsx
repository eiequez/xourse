"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import { Loader2Icon } from "lucide-react"

import { signup } from "@/app/auth/actions"
import { ALLOWED_EMAILS_TEXT } from "@/lib/allowed-emails"
import { cn } from "@/lib/utils"
import { FormError } from "@/components/auth/form-error"
import { GoogleButton } from "@/components/auth/google-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const input = "border-umber/60 bg-bone/3 text-bone placeholder:text-bone/35"

export function SignupForm({ className }: { className?: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-white">
            Create your account
          </h1>
          <p className="text-sm text-balance text-bone/60">
            Fill in the form below to create your account
          </p>
        </div>

        <FormError message={error} />

        <Field>
          <FieldLabel htmlFor="fullName" className="text-bone">
            Full name
          </FieldLabel>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            maxLength={60}
            className={input}
          />
        </Field>
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
            className={input}
          />
          <FieldDescription className="text-bone/50">
            Use a {ALLOWED_EMAILS_TEXT} address.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password" className="text-bone">
            Password
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
            Confirm password
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
            Create account
          </Button>
        </Field>
        <FieldSeparator className="text-bone/45">
          Or continue with
        </FieldSeparator>
        <Field>
          <GoogleButton label="Sign up with Google" onError={setError} />
          <FieldDescription className="px-6 text-center text-bone/55">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-sand underline underline-offset-4"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
