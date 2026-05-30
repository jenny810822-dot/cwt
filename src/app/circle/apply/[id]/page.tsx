"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { CheckCircle } from "lucide-react"

type Event = { id: number; title: string; eventDateStart: string; eventDateEnd: string; venue: string; priceHalf: number | null; priceFull: number | null; priceLarge: number | null }

const TABLE_OPTIONS = [
  { value: "half",  label: "半桌",  hint: "約 45×90 cm" },
  { value: "full",  label: "全桌",  hint: "約 90×90 cm" },
  { value: "large", label: "大桌",  hint: "約 180×90 cm" },
]

export default function ApplyPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [authed, setAuthed] = useState(false)
  const [tableType, setTableType] = useState("full")
  const [adjacentRequest, setAdjacentRequest] = useState("")
  const [note, setNote] = useState("")
  const submittingRef = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/circle/me")
      if (!me.ok) { router.push("/circle/login"); return }
      const meData = await me.json()
      if (meData.status !== "approved") { router.push("/circle/dashboard"); return }
      setAuthed(true)

      const ev = await fetch(`/api/circle?id=${id}`)
      if (ev.ok) {
        const data = await ev.json()
        const found = Array.isArray(data) ? data.find((e: Event) => e.id === Number(id)) : null
        setEvent(found ?? null)
      }
    }
    load()
  }, [id, router])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setError("")
    setSubmitting(true)
    const res = await fetch("/api/circle/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventApplicationId: Number(id), tableType, adjacentRequest, note }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "發生錯誤")
      setSubmitting(false)
      submittingRef.current = false
      return
    }
    setDone(true)
  }

  if (!authed) return null

  if (done) return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] flex items-center justify-center">
        <div className="text-center max-w-md px-8">
          <CheckCircle size={48} style={{ color: "#10b981" }} className="mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3" style={{ color: "#1a0f14" }}>報名成功！</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#6a5a60" }}>
            您的報名已送出，主辦單位審核後將以 Email 通知結果，請耐心等候。
          </p>
          <Link href="/circle/dashboard" className="text-sm font-medium" style={{ color: "#e8789a" }}>← 返回主頁</Link>
        </div>
      </main>
    </div>
  )

  const prices: Record<string, number | null> = { half: event?.priceHalf ?? null, full: event?.priceFull ?? null, large: event?.priceLarge ?? null }

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px]">
        <div className="relative px-10 pt-12 pb-10" style={{ background: "#140810" }}>
          <div className="text-[10px] tracking-[0.45em] mb-2 font-medium" style={{ color: "#e8789a" }}>CIRCLE APPLICATION</div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "white" }}>{event?.title ?? "報名場次"}</h1>
          {event && <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{event.eventDateStart} — {event.eventDateEnd} · {event.venue}</p>}
        </div>

        <div className="px-10 py-8 max-w-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "white", border: "1px solid #f0e4ea" }}>
              <h3 className="text-sm font-bold" style={{ color: "#1a0f14" }}>選擇桌位類型</h3>
              <div className="flex flex-col gap-2">
                {TABLE_OPTIONS.map(opt => {
                  const price = prices[opt.value]
                  if (price === null) return null
                  return (
                    <button key={opt.value} type="button" onClick={() => setTableType(opt.value)}
                      className="flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all"
                      style={{
                        background: tableType === opt.value ? "#1a0f14" : "#fdf8fa",
                        border: `1.5px solid ${tableType === opt.value ? "#1a0f14" : "#f0e4ea"}`,
                      }}>
                      <div>
                        <span className="text-sm font-bold" style={{ color: tableType === opt.value ? "white" : "#1a0f14" }}>{opt.label}</span>
                        <span className="text-xs ml-2" style={{ color: tableType === opt.value ? "rgba(255,255,255,0.5)" : "#9a8590" }}>{opt.hint}</span>
                      </div>
                      <span className="text-sm font-black" style={{ color: tableType === opt.value ? "#e8789a" : "#e8789a" }}>
                        NT${price.toLocaleString()}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "white", border: "1px solid #f0e4ea" }}>
              <h3 className="text-sm font-bold" style={{ color: "#1a0f14" }}>其他資訊</h3>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>
                  連攤申請 <span className="font-normal" style={{ color: "#9a8590" }}>— 填入欲連攤社團名稱（選填）</span>
                </label>
                <input value={adjacentRequest} onChange={e => setAdjacentRequest(e.target.value)}
                  placeholder="例：某某社"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                  onFocus={e => (e.target.style.borderColor = "#e8789a")}
                  onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>備註（選填）</label>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="其他需要告知主辦的事項…"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                  onFocus={e => (e.target.style.borderColor = "#e8789a")}
                  onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
                />
              </div>
            </div>

            {error && <p className="text-sm font-medium" style={{ color: "#e8789a" }}>{error}</p>}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={submitting}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: submitting ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
                {submitting ? "送出中…" : "確認送出"}
              </button>
              <Link href="/circle/dashboard" className="text-sm" style={{ color: "#9a8590" }}>取消</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
