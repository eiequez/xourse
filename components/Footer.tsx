// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-parchment/10 border-t px-6 py-10 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p
          className="text-parchment/60 text-sm"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Xourse
        </p>
        <p className="text-parchment/30 text-xs">
          Built by and for XMUM students. Not affiliated with the university
          administration.
        </p>
      </div>
    </footer>
  )
}
