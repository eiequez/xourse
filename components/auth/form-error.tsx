export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="rounded-md border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal"
    >
      {message}
    </div>
  )
}
