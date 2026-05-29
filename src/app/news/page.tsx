"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import PageShell from "@/components/PageShell"
import { ChevronRight } from "lucide-react"

const NEWS = [
  { date: "2025.05.20", title: "【CW68】社團報名資訊公告", tag: "重要", tagBg: "#e8789a", body: "CWT 68 台北場社團報名即將開始，請各社團留意官方公告，確認報名資格與繳費方式。" },
  { date: "2025.05.18", title: "【CW68】活動主視覺公開！", tag: "NEW", tagBg: "#c45578", body: "CWT 68 台北場官方主視覺正式公開！感謝本次視覺設計師的精彩作品。" },
  { date: "2025.05.10", title: "【場地資訊】台大綜合體育館交通指南", tag: null, tagBg: "", body: "整理捷運、公車、自行車各種交通方式，幫助大家順利抵達台大綜合體育館。" },
  { date: "2025.05.02", title: "【新手指南】第一次參加CWT就看這裡！", tag: null, tagBg: "", body: "第一次參加同人誌販售會嗎？從購票、現金準備到路線規劃，本指南一次說清楚。" },
]

const TAG_COLORS: Record<string, string> = {
  "重要": "#e8789a",
  "NEW": "#c45578",
}

export default function NewsPage() {
  return (
    <PageShell titleEn="NEWS" title="最新消息" subtitle="活動公告、重要通知與最新資訊">
      <div className="max-w-2xl flex flex-col gap-3">
        {NEWS.map(({ date, title, tag, tagBg, body }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 * i }}
            className="rounded-2xl overflow-hidden group cursor-pointer transition-all"
            style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 2px 10px rgba(232,120,154,0.06)" }}
          >
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-medium" style={{ color: "#b0a0a8" }}>{date}</span>
                {tag && (
                  <span
                    className="text-[9px] text-white px-2 py-0.5 rounded font-bold"
                    style={{ background: tagBg || TAG_COLORS[tag] || "#e8789a" }}
                  >
                    {tag}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold mb-1.5 leading-snug" style={{ color: "#1a0f14" }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#6a5a60" }}>{body}</p>
                </div>
                <ChevronRight size={15} className="shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" style={{ color: "#c0a0b0" }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
