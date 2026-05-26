import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Providers } from "@/components/Providers"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <Providers>{children}</Providers>
  }

  return (
    <Providers>
      <div className="flex min-h-screen" style={{ background: "#f5eef0" }}>
        <AdminSidebar session={session} />
        <div className="flex-1 ml-[220px] flex flex-col">
          {children}
        </div>
      </div>
    </Providers>
  )
}
