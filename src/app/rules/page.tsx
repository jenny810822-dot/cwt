"use client"
import { motion } from "framer-motion"
import PageShell from "@/components/PageShell"
import { ShieldCheck, Camera, Shirt, Ban } from "lucide-react"

const CATEGORIES = [
  {
    icon: ShieldCheck, title: "一般行為規範", color: "#e8789a", bg: "rgba(232,120,154,0.07)", border: "#f9d0de",
    rules: [
      "請遵守工作人員及廣播之指示。",
      "禁止在場內奔跑、推擠或大聲喧嘩。",
      "購買時請依序排隊，不得插隊或代人大量占位。",
      "請勿於走道停留堵塞通道，有意購買請排入隊伍。",
      "場內禁止飲食（礦泉水除外）。",
    ],
  },
  {
    icon: Camera, title: "攝影規範", color: "#a78bfa", bg: "rgba(167,139,250,0.07)", border: "#ddd6fe",
    rules: [
      "拍攝社團攤位及作品前，請務必獲得社團成員同意。",
      "禁止拍攝他人未公開之個人資料或證件。",
      "Cosplay 參加者同意可被拍攝，但拍攝前仍建議詢問。",
      "禁止直播或錄影至未公開平台，須事先申請許可。",
      "所有照片不得用於商業用途或未授權媒體。",
    ],
  },
  {
    icon: Shirt, title: "Cosplay 規定", color: "#10b981", bg: "rgba(16,185,129,0.07)", border: "#a7f3d0",
    rules: [
      "歡迎 Cosplay 入場，請於更衣室換裝。",
      "禁止全裸、過度暴露或高度仿真武器道具。",
      "大型道具需事先申請，通過後方可攜入。",
      "禁止妨礙他人行動或造成危險之裝扮。",
      "Cosplay 表演或拍攝活動請至指定區域進行。",
    ],
  },
  {
    icon: Ban, title: "禁止物品", color: "#ef4444", bg: "rgba(239,68,68,0.06)", border: "#fecaca",
    rules: [
      "危險物品：刀具、噴霧罐、打火機等。",
      "大型行李箱（輪子接觸地面者）。",
      "寵物（導盲犬除外）。",
      "散發強烈氣味之物品或食品。",
      "未申請之商業宣傳物或大型廣告布條。",
    ],
  },
]

const fade = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: 0.08 * i } })

export default function RulesPage() {
  return (
    <PageShell titleEn="RULES & REGULATIONS" title="活動規則" subtitle="請詳閱以下規定，共同維護良好的活動環境">

      <div className="grid grid-cols-2 gap-5">
        {CATEGORIES.map(({ icon: Icon, title, color, bg, rules }, i) => (
          <motion.div key={title} {...fade(i)} className="rounded-2xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}>
            <div className="h-1" style={{ background: color }} />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <h3 className="text-sm font-black" style={{ color: "#1a0f14" }}>{title}</h3>
              </div>
              <ol className="flex flex-col gap-2.5">
                {rules.map((rule, j) => (
                  <li key={j} className="flex gap-3 text-xs leading-relaxed" style={{ color: "#5a4550" }}>
                    <span className="shrink-0 font-black" style={{ color }}>{String(j + 1).padStart(2, "0")}</span>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fade(4)} className="mt-5 rounded-2xl px-5 py-4 text-xs leading-relaxed"
        style={{ background: "#fdf8fa", border: "1px solid #f0e4ea", color: "#8a7a80" }}>
        違反上述規定者，主辦單位有權請當事人離場，情節嚴重者將移送相關單位處理。本規則若有未盡事宜，以主辦單位公告為準。
      </motion.div>

    </PageShell>
  )
}
