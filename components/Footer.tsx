// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-umber/50 px-6 py-10 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-heading text-sm font-semibold tracking-tight text-bone/60">
          Xourse
        </p>
        <p className="text-center text-xs text-bone/30 sm:text-right">
          Built by and for XMUM students. Not affiliated with the university
          administration.
        </p>
      </div>
    </footer>
  )
}
