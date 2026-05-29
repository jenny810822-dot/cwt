"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CalendarDays, Users, Ticket, BookOpen, HelpCircle, Newspaper } from "lucide-react"

const NAV = [
  { href: "/", icon: Home, label: "首頁", sub: "HOME" },
  { href: "/news", icon: Newspaper, label: "最新消息", sub: "NEWS" },
  { href: "/event", icon: CalendarDays, label: "活動資訊", sub: "EVENT" },
  { href: "/circle", icon: Users, label: "社團報名", sub: "CIRCLE" },
  { href: "/attend", icon: Ticket, label: "一般參加", sub: "ATTEND" },
  { href: "/guide", icon: BookOpen, label: "新手上路", sub: "GUIDE" },
  { href: "/faq", icon: HelpCircle, label: "常見問題", sub: "FAQ" },
]

export default function NavRail() {
  const path = usePathname()
  return (
    <nav className="fixed left-0 top-0 h-screen w-[140px] z-50 flex flex-col py-6 px-3" style={{ background: "#f2ece8" }}>
      <div className="mb-8 pl-2">
        <div className="text-[22px] font-black leading-none" style={{ color: "#1a0f14" }}>CWT</div>
        <div className="text-[8px] mt-1 leading-snug" style={{ color: "#9a8590" }}>
          台灣同人誌販售會<br />TAIWAN COMIC WORLD
        </div>
      </div>

      <div className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: active ? "#1a0f14" : "transparent",
                color: active ? "white" : "#5a4550",
              }}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              <div>
                <div className="text-[11px] font-semibold leading-none">{label}</div>
                <div className="text-[9px] mt-0.5 leading-none" style={{ color: active ? "rgba(255,255,255,0.5)" : "#9a8590" }}>
                  {sub}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="pl-2">
        <div className="text-[9px] font-medium tracking-wider mb-2" style={{ color: "#9a8590" }}>FOLLOW US</div>
        <div className="flex gap-2">
          {["IG", "X", "FB", "L"].map(s => (
            <button
              key={s}
              className="w-6 h-6 rounded-full text-[8px] font-bold transition-colors"
              style={{ background: "#e0d5d0", color: "#5a4550" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
