import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Newspaper, CalendarDays, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  const [newsCount, memberCount, event, recentNews] = await Promise.all([
    prisma.newsItem.count(),
    prisma.user.count(),
    prisma.event.findFirst({ orderBy: { id: "desc" } }),
    prisma.newsItem.findMany({ take: 5, orderBy: { sortOrder: "asc" } }),
  ])

  const daysLeft = event
    ? Math.max(0, Math.ceil((new Date(event.dateStart).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>
          歡迎回來，{session?.user?.name} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>CWT 後台管理系統</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: CalendarDays,
            label: "活動倒數",
            value: daysLeft !== null ? `${daysLeft} 天` : "—",
            sub: event ? `CW${event.edition} · ${event.dateStart}` : "尚未設定",
            href: "/admin/event",
            accent: "#e8789a",
            bg: "rgba(232,120,154,0.08)",
          },
          {
            icon: Newspaper,
            label: "消息則數",
            value: newsCount,
            sub: "已建立的最新消息",
            href: "/admin/news",
            accent: "#c45578",
            bg: "rgba(196,85,120,0.08)",
          },
          {
            icon: Users,
            label: "後台成員",
            value: memberCount,
            sub: "管理員與編輯者",
            href: "/admin/members",
            accent: "#8a4560",
            bg: "rgba(138,69,96,0.08)",
          },
        ].map(({ icon: Icon, label, value, sub, href, accent, bg }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl p-6 flex flex-col gap-4 transition-all hover:scale-[1.01] hover:shadow-lg group"
            style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={18} style={{ color: accent }} />
              </div>
              <ArrowRight size={14} style={{ color: "#c0a0b0" }} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-3xl font-black" style={{ color: "#1a0f14" }}>{value}</div>
              <div className="text-xs font-semibold mt-1" style={{ color: "#5a4550" }}>{label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#b0a0a8" }}>{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent news */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
      >
        {/* Card header strip */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f5eef2" }}>
          <h2 className="text-sm font-bold" style={{ color: "#1a0f14" }}>最新消息</h2>
          <Link
            href="/admin/news"
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: "#e8789a" }}
          >
            管理 <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex flex-col">
          {recentNews.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-[#fdf8fa]"
              style={{ borderBottom: "1px solid #fdf0f4" }}
            >
              <span className="text-[11px] w-10 flex-shrink-0" style={{ color: "#b0a0a8" }}>{item.date}</span>
              <span className="text-sm flex-1 truncate" style={{ color: "#2a1a20" }}>{item.title}</span>
              {item.tag && (
                <span
                  className="text-[9px] text-white px-2 py-0.5 rounded font-bold"
                  style={{ background: item.tagColor ?? "#e8789a" }}
                >
                  {item.tag}
                </span>
              )}
              <span
                className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  background: item.published ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.1)",
                  color: item.published ? "#16a34a" : "#6b7280",
                }}
              >
                {item.published ? "已發布" : "草稿"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
