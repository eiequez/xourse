"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import { Loader2Icon } from "lucide-react"

import { login } from "@/app/auth/actions"
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

export function LoginForm({
  initialError = null,
  className,
}: {
  initialError?: string | null
  className?: string
}) {
  const [error, setError] = useState<string | null>(initialError)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
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
            Login to your account
          </h1>
          <p className="text-sm text-balance text-bone/60">
            Enter your email below to login to your account
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
            className={input}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-bone">
              Password
            </FieldLabel>
            <Link
              href="/auth/forgot-password"
              className="ml-auto text-sm text-sand underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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
            Login
          </Button>
        </Field>
        <FieldSeparator className="text-bone/45">
          Or continue with
        </FieldSeparator>
        <Field>
          <GoogleButton label="Login with Google" onError={setError} />
          <FieldDescription className="text-center text-bone/55">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-sand underline underline-offset-4"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
