import Sidebar from "@/components/layout/sidebar"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen lg:pl-80 lg:pt-0">{children}</div>
    </>
  )
}
