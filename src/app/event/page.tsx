"use client"
import { motion } from "framer-motion"
import NavRail from "@/components/NavRail"
import { MapPin, Clock, ChevronRight, ArrowUpRight } from "lucide-react"

// ── Placeholder data (will be replaced by DB later) ──────────────────────────

const NEXT_EVENT = {
  nameEn: "CWT 68",
  nameSub: "台北場",
  dateStart: "2026-12-26",
  dateEnd: "2026-12-27",
  timeStart: "10:30",
  timeEnd: "16:30",
  venue: "台大綜合體育館 1F & B1",
  accentColor: "#e8789a",
  status: "upcoming" as const,
}

const PAST_EVENTS = [
  { id: 67, nameEn: "CWT 67", nameSub: "台北場", dateStart: "2025-08-30", dateEnd: "2025-08-31", venue: "台大綜合體育館 1F & B1", circles: 1840 },
  { id: 66, nameEn: "CWT 66", nameSub: "台北場", dateStart: "2025-04-26", dateEnd: "2025-04-27", venue: "台大綜合體育館 1F & B1", circles: 1720 },
  { id: 65, nameEn: "CWT 65", nameSub: "台北場", dateStart: "2024-12-28", dateEnd: "2024-12-29", venue: "台大綜合體育館 1F & B1", circles: 1900 },
  { id: 64, nameEn: "CWT 64", nameSub: "台北場", dateStart: "2024-08-31", dateEnd: "2024-09-01", venue: "台大綜合體育館 1F & B1", circles: 1650 },
  { id: 63, nameEn: "CWT 63", nameSub: "台北場", dateStart: "2024-04-27", dateEnd: "2024-04-28", venue: "台大綜合體育館 1F & B1", circles: 1580 },
  { id: 62, nameEn: "CWT 62", nameSub: "台北場", dateStart: "2023-12-30", dateEnd: "2023-12-31", venue: "台大綜合體育館 1F & B1", circles: 1700 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const DOW_ZH = ["日", "一", "二", "三", "四", "五", "六"]

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function fmtDateRange(start: string, end: string) {
  const s = parseDate(start)
  const e = parseDate(end)
  const sm = String(s.getMonth() + 1).padStart(2, "0")
  const sd = String(s.getDate()).padStart(2, "0")
  const em = String(e.getMonth() + 1).padStart(2, "0")
  const ed = String(e.getDate()).padStart(2, "0")
  const sy = s.getFullYear()
  if (sm === em) return `${sy}.${sm}.${sd}（${DOW_ZH[s.getDay()]}）— ${ed}（${DOW_ZH[e.getDay()]}）`
  return `${sy}.${sm}.${sd} — ${em}.${ed}`
}

function fmtYear(iso: string) { return iso.slice(0, 4) }

// ── Components ────────────────────────────────────────────────────────────────

function FeaturedEvent() {
  const ev = NEXT_EVENT
  const s = parseDate(ev.dateStart)
  const e = parseDate(ev.dateEnd)
  const sm = String(s.getMonth() + 1).padStart(2, "0")
  const sd = String(s.getDate()).padStart(2, "0")
  const em = String(e.getMonth() + 1).padStart(2, "0")
  const ed = String(e.getDate()).padStart(2, "0")

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden mb-12"
      style={{ background: "white", boxShadow: "0 8px 48px rgba(232,120,154,0.18)" }}
    >
      {/* Top gradient bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(to right, ${ev.accentColor}, #c45578)` }} />

      <div className="p-8 md:p-10">
        {/* Status badge */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider"
            style={{ background: "rgba(232,120,154,0.12)", color: ev.accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ev.accentColor }} />
            NEXT EVENT
          </span>
          <span className="text-[11px]" style={{ color: "#9a8590" }}>{fmtYear(ev.dateStart)}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-end">
          {/* Left: name + dates */}
          <div>
            <div className="text-4xl font-black tracking-tight mb-1" style={{ color: ev.accentColor }}>
              {ev.nameEn}
            </div>
            <div className="text-xl font-semibold mb-6" style={{ color: "#5a4550" }}>
              {ev.nameSub}
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-black leading-none tracking-tight" style={{ fontSize: 52, color: "#1a0f14" }}>
                {sm}.{sd}
              </span>
              <span className="text-lg" style={{ color: "#8a7a80" }}>（{DOW_ZH[s.getDay()]}）</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-black leading-none tracking-tight" style={{ fontSize: 52, color: "#1a0f14" }}>
                {em}.{ed}
              </span>
              <span className="text-lg" style={{ color: "#8a7a80" }}>（{DOW_ZH[e.getDay()]}）</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: "#6a5a60" }}>
                <Clock size={13} style={{ color: ev.accentColor }} />
                {ev.timeStart} — {ev.timeEnd}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#6a5a60" }}>
                <MapPin size={13} style={{ color: ev.accentColor }} />
                {ev.venue}
              </div>
            </div>
          </div>

          {/* Right: quick links */}
          <div className="flex flex-col gap-3">
            {[
              { label: "社團報名資訊", sub: "Circle Application" },
              { label: "一般參加指南", sub: "Attendee Guide" },
              { label: "交通 & 場館資訊", sub: "Venue & Access" },
            ].map(({ label, sub }) => (
              <button
                key={label}
                className="flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-all"
                style={{ background: "#fdf8fa", border: "1px solid #f0e4ea" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,120,154,0.08)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#e8789a"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#fdf8fa"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#f0e4ea"
                }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#1a0f14" }}>{label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#9a8590" }}>{sub}</div>
                </div>
                <ArrowUpRight size={15} style={{ color: "#c0a0b0" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PastEventCard({ ev, index }: { ev: typeof PAST_EVENTS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(232,120,154,0.06)"
        ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,120,154,0.2)"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"
        ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"
      }}
    >
      {/* Edition number accent strip */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(232,120,154,0.1)", color: "#e8789a" }}
          >
            已結束
          </div>
          <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} className="group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div className="text-3xl font-black tracking-tight leading-none mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>
          {ev.nameEn}
        </div>
        <div className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{ev.nameSub}</div>

        <div className="text-[11px] font-medium mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
          {fmtDateRange(ev.dateStart, ev.dateEnd)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          <MapPin size={10} />
          {ev.venue}
        </div>
      </div>

      <div
        className="mx-5 mb-5 px-3 py-2 rounded-xl flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>參展社團</span>
        <span className="text-sm font-black" style={{ color: "rgba(255,255,255,0.6)" }}>{ev.circles.toLocaleString()}</span>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EventPage() {
  return (
    <div className="flex min-h-screen" style={{ background: "#0e080c" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] px-10 py-12 max-w-[1100px]">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="text-[10px] tracking-[0.4em] mb-2 font-medium" style={{ color: "#e8789a" }}>
            EVENTS
          </div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "white" }}>活動資訊</h1>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            台灣同人誌販售會 · 歷屆活動總覽
          </p>
        </motion.div>

        {/* Next event */}
        <FeaturedEvent />

        {/* Past events */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.4em] mb-1 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
              ARCHIVE
            </div>
            <h2 className="text-lg font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>往屆活動</h2>
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>共 {PAST_EVENTS.length} 屆</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAST_EVENTS.map((ev, i) => (
            <PastEventCard key={ev.id} ev={ev} index={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
