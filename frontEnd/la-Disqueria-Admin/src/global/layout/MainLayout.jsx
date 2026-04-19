import Navbar from "@/global/components/Navbar"

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <Navbar />

      <div className="w-full max-w-6xl px-4 mt-6">
        {children}
      </div>
    </div>
  )
}