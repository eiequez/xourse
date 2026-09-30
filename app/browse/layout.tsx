import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

export default function BrowseLayout({ children }: LayoutProps<"/browse">) {
  return (
    <div className="flex min-h-screen flex-col bg-night">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
