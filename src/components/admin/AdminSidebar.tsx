"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Newspaper, CalendarDays, Users, LogOut, ChevronRight } from "lucide-react"
import type { Session } from "next-auth"

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "儀表板", sub: "DASHBOARD" },
  { href: "/admin/news", icon: Newspaper, label: "最新消息", sub: "NEWS" },
  { href: "/admin/event", icon: CalendarDays, label: "活動資訊", sub: "EVENT" },
  { href: "/admin/members", icon: Users, label: "成員管理", sub: "MEMBERS" },
]

export default function AdminSidebar({ session }: { session: Session }) {
  const path = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-50"
      style={{ background: "#1a0f14" }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="text-white font-black text-xl tracking-tight leading-none">CWT</div>
        <div className="text-[10px] mt-1 tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          ADMIN SYSTEM
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = path === href || (href !== "/admin" && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group"
              style={{
                background: active ? "rgba(232,120,154,0.15)" : "transparent",
                color: active ? "#e8789a" : "rgba(255,255,255,0.55)",
              }}
            >
              {active && (
                <div
                  className="absolute left-3 w-0.5 h-6 rounded-full"
                  style={{ background: "#e8789a" }}
                />
              )}
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <div className="flex-1">
                <div className="text-[12px] font-semibold leading-none">{label}</div>
                <div className="text-[9px] mt-0.5 leading-none opacity-50">{sub}</div>
              </div>
              {active && <ChevronRight size={12} style={{ color: "#e8789a" }} />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "#e8789a" }}
          >
            {session.user?.name?.[0] ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white truncate">{session.user?.name}</div>
            <div className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
              {(session.user as { role?: string })?.role === "admin" ? "管理員" : "編輯者"}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[11px] transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <LogOut size={13} />
          登出
        </button>
      </div>
    </aside>
  )
}
