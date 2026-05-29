"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Newspaper, CalendarDays, Users, LogOut, ChevronRight, ImageIcon, LayoutGrid, ClipboardList } from "lucide-react"
import type { Session } from "next-auth"

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "儀表板", sub: "DASHBOARD" },
  { href: "/admin/banner", icon: ImageIcon, label: "主視覺", sub: "BANNER" },
  { href: "/admin/quickentry", icon: LayoutGrid, label: "快速入口", sub: "QUICK ENTRY" },
  { href: "/admin/news", icon: Newspaper, label: "最新消息", sub: "NEWS" },
  { href: "/admin/circle", icon: ClipboardList, label: "社團報名", sub: "CIRCLE" },
  { href: "/admin/event", icon: CalendarDays, label: "活動資訊", sub: "EVENT" },
  { href: "/admin/members", icon: Users, label: "成員管理", sub: "MEMBERS" },
]

export default function AdminSidebar({ session }: { session: Session }) {
  const path = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-50"
      style={{
        background: "#f2ece8",
        borderRight: "1px solid #ede0e4",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: "1px solid #ede0e4" }}>
        <div className="font-black text-xl tracking-tight leading-none" style={{ color: "#1a0f14" }}>CWT</div>
        <div className="text-[8px] mt-1 leading-snug" style={{ color: "#9a8590" }}>
          台灣同人誌販售會<br />TAIWAN COMIC WORLD
        </div>
        <div
          className="inline-block mt-2 text-[9px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(232,120,154,0.12)", color: "#e8789a" }}
        >
          ADMIN
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative"
              style={{
                background: active ? "#1a0f14" : "transparent",
                color: active ? "white" : "#5a4550",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "#e8dcd8" }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent" }}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              <div className="flex-1">
                <div className="text-[12px] font-semibold leading-none">{label}</div>
                <div
                  className="text-[9px] mt-0.5 leading-none"
                  style={{ color: active ? "rgba(255,255,255,0.45)" : "#9a8590" }}
                >
                  {sub}
                </div>
              </div>
              {active && <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.5)" }} />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #ede0e4" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "#e8789a" }}
          >
            {session.user?.name?.[0] ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold truncate" style={{ color: "#1a0f14" }}>
              {session.user?.name}
            </div>
            <div className="text-[10px] truncate" style={{ color: "#9a8590" }}>
              {(session.user as { role?: string })?.role === "admin" ? "管理員" : "編輯者"}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[11px] transition-colors hover:bg-[#e8dcd8]"
          style={{ color: "#8a7a80" }}
        >
          <LogOut size={13} />
          登出
        </button>
      </div>
    </aside>
  )
}
