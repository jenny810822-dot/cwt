"use client"
import { motion } from "framer-motion"
import PageShell from "@/components/PageShell"
import { AlertCircle } from "lucide-react"

const STEPS = [
  { step: "01", title: "閱讀報名須知", desc: "詳閱最新公告與社團參展規範，確認資格與收費方式。" },
  { step: "02", title: "填寫報名表單", desc: "於報名系統填寫社團資料、選擇桌位類型並上傳素材。" },
  { step: "03", title: "繳交報名費用", desc: "完成報名後依指定方式繳費，逾期未繳視同放棄資格。" },
  { step: "04", title: "等待審核結果", desc: "主辦單位審核完畢後以 Email 通知結果，請留意信箱。" },
]

const FEES = [
  { type: "普通桌（半桌）", size: "45 × 90 cm", price: "NT$ 800", note: "適合個人社或新手" },
  { type: "普通桌（全桌）", size: "90 × 90 cm", price: "NT$ 1,500", note: "最常見規格" },
  { type: "大桌（全桌+）", size: "120 × 90 cm", price: "NT$ 2,200", note: "需提前申請" },
]

const DATES = [
  { label: "報名開始", date: "2026.09.01" },
  { label: "報名截止", date: "2026.09.30" },
  { label: "錄取公告", date: "2026.10.20" },
  { label: "費用繳交截止", date: "2026.11.05" },
]

const card = { background: "white", boxShadow: "0 2px 12px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }
const fade = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: 0.06 * i } })

function SectionTitle({ en, zh }: { en: string; zh: string }) {
  return (
    <div className="mb-4">
      <div className="text-[9px] tracking-[0.4em] mb-1 font-medium" style={{ color: "#b0a0a8" }}>{en}</div>
      <h2 className="text-base font-black" style={{ color: "#1a0f14" }}>{zh}</h2>
    </div>
  )
}

export default function CirclePage() {
  return (
    <PageShell titleEn="CIRCLE APPLICATION" title="社團報名" subtitle="參展社團報名資訊、流程與費用說明">

      {/* Status banner */}
      <motion.div {...fade(0)} className="rounded-2xl px-5 py-3.5 mb-7 flex items-center justify-between"
        style={{ background: "rgba(232,120,154,0.07)", border: "1px solid rgba(232,120,154,0.2)" }}>
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#e8789a" }} />
          <span className="text-sm font-semibold" style={{ color: "#1a0f14" }}>CWT 68 社團報名</span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(232,120,154,0.12)", color: "#e8789a" }}>
            尚未開放
          </span>
        </div>
        <span className="text-xs" style={{ color: "#9a8590" }}>預計 2026.09 開放</span>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 mb-7">
        {/* Steps */}
        <motion.div {...fade(1)} className="col-span-2">
          <SectionTitle en="PROCESS" zh="報名流程" />
          <div className="flex flex-col gap-3">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start rounded-2xl px-5 py-4" style={card}>
                <div className="text-2xl font-black shrink-0 leading-none" style={{ color: "rgba(232,120,154,0.3)" }}>{step}</div>
                <div>
                  <div className="text-sm font-bold mb-0.5" style={{ color: "#1a0f14" }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#8a7a80" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dates */}
        <motion.div {...fade(2)}>
          <SectionTitle en="SCHEDULE" zh="重要日程" />
          <div className="flex flex-col gap-2">
            {DATES.map(({ label, date }) => (
              <div key={label} className="rounded-xl px-4 py-3" style={card}>
                <div className="text-[10px] mb-0.5" style={{ color: "#9a8590" }}>{label}</div>
                <div className="text-sm font-black tabular-nums" style={{ color: "#1a0f14" }}>{date}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fee table */}
      <motion.div {...fade(3)} className="mb-7">
        <SectionTitle en="FEES" zh="費用說明" />
        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="h-0.5" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />
          <div className="grid grid-cols-4 px-5 py-3 text-[10px] font-semibold tracking-wider"
            style={{ background: "#fdf8fa", borderBottom: "1px solid #f0e4ea", color: "#9a8590" }}>
            {["桌位類型", "尺寸", "費用", "備註"].map(h => <div key={h}>{h}</div>)}
          </div>
          {FEES.map(({ type, size, price, note }, i) => (
            <div key={type} className="grid grid-cols-4 px-5 py-4 text-sm"
              style={{ borderBottom: i < FEES.length - 1 ? "1px solid #fdf0f4" : "none" }}>
              <div className="font-semibold" style={{ color: "#1a0f14" }}>{type}</div>
              <div style={{ color: "#6a5a60" }}>{size}</div>
              <div className="font-black" style={{ color: "#e8789a" }}>{price}</div>
              <div className="text-xs" style={{ color: "#9a8590" }}>{note}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notice */}
      <motion.div {...fade(4)} className="rounded-2xl px-5 py-4 flex gap-3"
        style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
        <AlertCircle size={15} className="shrink-0 mt-0.5" style={{ color: "#d97706" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#6a5a60" }}>
          報名資格、桌位分配及相關規定以當屆公告為準，主辦單位保留最終決定權。如有疑問請透過官方聯絡管道詢問，恕不接受非官方之交桌、轉讓行為。
        </p>
      </motion.div>

    </PageShell>
  )
}
