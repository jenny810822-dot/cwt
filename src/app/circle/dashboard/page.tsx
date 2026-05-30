"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { CheckCircle, Clock, XCircle, LogOut, ExternalLink } from "lucide-react"

type Circle = {
  id: number; name: string; leaderName: string; email: string; phone: string
  type: string; genres: string; portfolioUrl: string; snsUrl: string; status: string
}
type Application = {
  id: number; eventApplicationId: number; tableType: string; status: string; createdAt: string
  event: { id: number; title: string; eventDateStart: string; eventDateEnd: string; status: string } | null
}

const TABLE_LABELS: Record<string, string> = { half: "半桌", full: "全桌", large: "大桌" }
const APP_STATUS: Record<string, { label: string; color: string }> = {
  pending:  { label: "審核中",  color: "#a78bfa" },
  approved: { label: "錄取",    color: "#10b981" },
  rejected: { label: "未錄取",  color: "#9a8590" },
  paid:     { label: "已繳費",  color: "#e8789a" },
}

export default function CircleDashboard() {
  const router = useRouter()
  const [circle, setCircle] = useState<Circle | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [openEvents, setOpenEvents] = useState<{ id: number; title: string; eventDateStart: string; eventDateEnd: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/circle/me")
      if (!me.ok) { router.push("/circle/login"); return }
      const data = await me.json()
      setCircle(data)

      const [appsRes, eventsRes] = await Promise.all([
        fetch("/api/circle/apply"),
        fetch("/api/circle"),
      ])
      if (appsRes.ok) setApplications(await appsRes.json())
      if (eventsRes.ok) {
        const events = await eventsRes.json()
        setOpenEvents(events.filter((e: { status: string }) => e.status === "open"))
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function logout() {
    await fetch("/api/circle/logout", { method: "POST" })
    router.push("/circle/login")
  }

  if (loading) return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] flex items-center justify-center">
        <p className="text-sm" style={{ color: "#9a8590" }}>載入中…</p>
      </main>
    </div>
  )

  if (!circle) return null

  const appliedEventIds = new Set(applications.map(a => a.eventApplicationId))
  const availableEvents = openEvents.filter(e => !appliedEventIds.has(e.id))

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px]">
        <div className="relative px-10 pt-12 pb-10" style={{ background: "#140810" }}>
          <div className="text-[10px] tracking-[0.45em] mb-2 font-medium" style={{ color: "#e8789a" }}>CIRCLE DASHBOARD</div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight" style={{ color: "white" }}>{circle.name}</h1>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{circle.leaderName} · {circle.email}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-colors"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
              <LogOut size={13} /> 登出
            </button>
          </div>
        </div>

        <div className="px-10 py-8 flex flex-col gap-6 max-w-3xl">

          {/* Account status */}
          <StatusBanner status={circle.status} />

          {/* Available events to apply */}
          {circle.status === "approved" && availableEvents.length > 0 && (
            <section>
              <SectionTitle>可報名場次</SectionTitle>
              <div className="flex flex-col gap-3">
                {availableEvents.map(ev => (
                  <div key={ev.id} className="rounded-2xl px-6 py-4 flex items-center justify-between"
                    style={{ background: "white", border: "1px solid #f0e4ea" }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#1a0f14" }}>{ev.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#9a8590" }}>{ev.eventDateStart} — {ev.eventDateEnd}</p>
                    </div>
                    <Link href={`/circle/apply/${ev.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{ background: "#e8789a" }}>
                      立即報名
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* My applications */}
          {applications.length > 0 && (
            <section>
              <SectionTitle>我的報名紀錄</SectionTitle>
              <div className="flex flex-col gap-3">
                {applications.map(app => {
                  const st = APP_STATUS[app.status] ?? { label: app.status, color: "#9a8590" }
                  return (
                    <div key={app.id} className="rounded-2xl px-6 py-4"
                      style={{ background: "white", border: "1px solid #f0e4ea" }}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold" style={{ color: "#1a0f14" }}>{app.event?.title ?? `場次 #${app.eventApplicationId}`}</p>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: `${st.color}18`, color: st.color }}>{st.label}</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "#9a8590" }}>
                        桌位：{TABLE_LABELS[app.tableType] ?? app.tableType} ·
                        報名時間：{new Date(app.createdAt).toLocaleDateString("zh-TW")}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Account info */}
          <section>
            <SectionTitle>帳號資料</SectionTitle>
            <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid #f0e4ea" }}>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  { k: "社團名稱", v: circle.name },
                  { k: "負責人", v: circle.leaderName },
                  { k: "聯絡信箱", v: circle.email },
                  { k: "聯絡電話", v: circle.phone },
                  { k: "社團性質", v: circle.type === "doujin" ? "一般同人社" : "代理攤" },
                  { k: "創作類型", v: circle.genres || "—" },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <dt className="text-[10px] font-semibold mb-0.5" style={{ color: "#9a8590" }}>{k}</dt>
                    <dd style={{ color: "#1a0f14" }}>{v}</dd>
                  </div>
                ))}
              </dl>
              {circle.portfolioUrl && (
                <a href={circle.portfolioUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium"
                  style={{ color: "#e8789a" }}>
                  <ExternalLink size={11} /> 作品連結
                </a>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function StatusBanner({ status }: { status: string }) {
  const map = {
    pending:  { icon: Clock, color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", title: "審核中", desc: "您的帳號正在審核中，主辦單位將於 7–10 個工作天內完成審核，結果將以 Email 通知。" },
    approved: { icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.25)", title: "審核通過", desc: "您的帳號已通過審核，可以開始報名下方的開放場次。" },
    rejected: { icon: XCircle, color: "#e8789a", bg: "rgba(232,120,154,0.07)", border: "rgba(232,120,154,0.25)", title: "審核未通過", desc: "很抱歉，您的帳號申請未通過審核。如有疑問請聯絡主辦單位：CWT@comicworld.com.tw" },
  }
  const s = map[status as keyof typeof map] ?? map.pending
  const Icon = s.icon
  return (
    <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <Icon size={18} className="mt-0.5 flex-shrink-0" style={{ color: s.color }} />
      <div>
        <p className="text-sm font-bold" style={{ color: s.color }}>{s.title}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#5a4550" }}>{s.desc}</p>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold mb-3" style={{ color: "#1a0f14" }}>{children}</h2>
}
