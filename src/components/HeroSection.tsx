"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import CountdownWidget from "./Countdown"
import NewsWidget from "./NewsWidget"

const PETALS = [
  { top: "14%", left: "38%", size: 8, delay: 0 },
  { top: "28%", left: "60%", size: 5, delay: 0.8 },
  { top: "52%", left: "43%", size: 6, delay: 1.5 },
  { top: "19%", left: "68%", size: 4, delay: 0.4 },
  { top: "67%", left: "55%", size: 7, delay: 1.2 },
  { top: "40%", left: "33%", size: 4, delay: 2.0 },
  { top: "75%", left: "48%", size: 5, delay: 0.6 },
]

const DOW = ["日", "一", "二", "三", "四", "五", "六"]

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function fmtMD(iso: string) {
  const [, m, d] = iso.split("-")
  return `${m}.${d}`
}

interface EventData {
  edition: number
  nameEn: string
  nameSub: string
  dateStart: string
  dateEnd: string
  timeStart: string
  timeEnd: string
  venue: string
  accentColor: string
  heroImage?: string | null
}

const FALLBACK: EventData = {
  edition: 68,
  nameEn: "CWT 68",
  nameSub: "台北場",
  dateStart: "2025-12-27",
  dateEnd: "2025-12-28",
  timeStart: "10:30",
  timeEnd: "16:30",
  venue: "台大綜合體育館 1F & B1",
  accentColor: "#e8789a",
}

export default function HeroSection({ event }: { event?: EventData }) {
  const ev = event ?? FALLBACK
  const accent = ev.accentColor || "#e8789a"
  const dowStart = DOW[parseDate(ev.dateStart).getDay()]
  const dowEnd = DOW[parseDate(ev.dateEnd).getDay()]

  return (
    <section className="relative overflow-hidden" style={{ height: "100vh", background: "#1c0f18" }}>

      {/* Full-bleed hero image */}
      {ev.heroImage ? (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={ev.heroImage}
            alt="主視覺"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
      ) : (
        <>
          <div className="absolute rounded-full" style={{ top: "50%", left: "45%", width: 480, height: 580, transform: "translate(-50%, -50%)", background: "rgba(232,120,154,0.13)", filter: "blur(120px)" }} />
          <div className="absolute rounded-full" style={{ top: "22%", left: "52%", width: 240, height: 300, background: "rgba(196,85,120,0.10)", filter: "blur(80px)" }} />
          <div className="absolute rounded-full" style={{ bottom: "8%", left: "34%", width: 320, height: 200, background: "rgba(245,198,216,0.07)", filter: "blur(60px)" }} />
        </>
      )}

      {/* Gradient overlay — dark on left for text legibility, transparent on right */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, #140810 0%, rgba(20,8,16,0.88) 22%, rgba(20,8,16,0.4) 45%, rgba(20,8,16,0.05) 70%, transparent 100%)" }}
      />

      {/* Floating petals */}
      {PETALS.map(({ top, left, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ top, left, width: size, height: size, background: "rgba(232,120,154,0.4)" }}
          animate={{ y: [0, -16, 0], opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}

      {/* Top right controls */}
      <div className="absolute top-6 right-6 flex items-center gap-5 z-20" style={{ color: "rgba(255,255,255,0.45)" }}>
        <button className="text-sm hover:text-white transition-colors">🔍</button>
        <span className="text-[11px] tracking-widest font-medium hover:text-white transition-colors cursor-pointer">MENU</span>
        <button className="text-xl hover:text-white transition-colors">≡</button>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex">
        {/* Left: Event info */}
        <div className="flex-1 flex flex-col justify-end pb-16 pl-10 pr-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="mb-2">
              <div className="text-3xl font-black tracking-tight leading-tight" style={{ color: accent }}>
                {ev.nameEn || `CWT ${ev.edition}`}
              </div>
              {ev.nameSub && (
                <div className="text-lg font-semibold mt-1 mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {ev.nameSub}
                </div>
              )}
            </div>

            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-black leading-none tracking-tight" style={{ fontSize: 68, color: accent }}>
                {fmtMD(ev.dateStart)}
              </span>
              <span className="text-xl" style={{ color: "rgba(255,255,255,0.6)" }}>（{dowStart}）</span>
            </div>
            <div className="mb-8 flex items-baseline gap-3">
              <span className="font-black leading-none tracking-tight" style={{ fontSize: 68, color: accent }}>
                {fmtMD(ev.dateEnd)}
              </span>
              <span className="text-xl" style={{ color: "rgba(255,255,255,0.6)" }}>（{dowEnd}）</span>
            </div>

            <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              {ev.timeStart} — {ev.timeEnd}
            </div>
            <div className="flex items-center gap-1.5 text-sm mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>📍</span>
              <span>{ev.venue}</span>
            </div>

            <Link href="/event">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-full text-sm font-medium flex items-center gap-2 w-fit transition-colors duration-300"
                style={{ background: "#1a0f14", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = accent
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = accent
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1a0f14"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"
                }}
              >
                活動資訊 VIEW MORE →
              </motion.button>
            </Link>
          </motion.div>

          <div className="mt-12">
            <div className="text-[9px] tracking-[0.4em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              FOLLOW US
            </div>
            <div className="flex gap-4">
              {["IG", "X", "FB", "LINE"].map(s => (
                <button
                  key={s}
                  className="text-[11px] font-medium tracking-wider transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = accent)}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Widget column */}
        <div className="w-[360px] flex flex-col gap-3 pt-16 pb-8 pr-6 overflow-y-auto">
          <CountdownWidget target={ev.dateStart && ev.timeStart ? `${ev.dateStart}T${ev.timeStart}:00+08:00` : undefined} />
          <NewsWidget />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 80, background: "linear-gradient(to top, #140810, transparent)" }}
      />
    </section>
  )
}
