import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="flex min-h-screen flex-col bg-night">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
