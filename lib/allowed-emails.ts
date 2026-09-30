// Must match public.enforce_email_domain() in the database, which is the
// real guard (it also covers Google sign-in). This copy gives early feedback.
export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "mail.ru",
  "outlook.com",
  "xmu.edu.my",
]

export function isAllowedEmail(email: string) {
  const domain = email.trim().toLowerCase().split("@")[1] ?? ""
  return ALLOWED_EMAIL_DOMAINS.includes(domain)
}

// "@gmail.com, @mail.ru, @outlook.com or @xmu.edu.my"
export const ALLOWED_EMAILS_TEXT = ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`)
  .join(", ")
  .replace(/, (?=[^,]*$)/, " or ")

export const EMAIL_DOMAIN_ERROR = `Only ${ALLOWED_EMAILS_TEXT} emails can sign up.`
