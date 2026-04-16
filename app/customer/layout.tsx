import Sidebar from "@/components/Sidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="CUSTOMER" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  )
}
