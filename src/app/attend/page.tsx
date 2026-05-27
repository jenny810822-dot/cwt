"use client"
import { motion } from "framer-motion"
import PageShell from "@/components/PageShell"
import { Clock, MapPin, Wallet, ShoppingBag, AlertTriangle, CheckCircle2 } from "lucide-react"

const INFO = [
  { icon: Clock, label: "開放時間", value: "10:30 — 16:30", sub: "兩日相同" },
  { icon: Wallet, label: "入場費用", value: "免費入場", sub: "憑場刊可換取福袋" },
  { icon: MapPin, label: "活動地點", value: "台大綜合體育館", sub: "1F & B1" },
  { icon: ShoppingBag, label: "場刊販售", value: "NT$ 100", sub: "現場購買，售完為止" },
]

const TIPS = [
  { title: "提早入場", desc: "建議 10:00 前抵達現場排隊，熱門攤位開場即可能售完。" },
  { title: "準備零錢", desc: "許多社團僅接受現金，建議攜帶小面額鈔票與零錢。" },
  { title: "自備購物袋", desc: "現場可攜帶大型購物袋或小推車，方便帶走大量戰利品。" },
  { title: "注意補水", desc: "場內人流眾多，建議攜帶飲用水並做好防曬準備。" },
]

const PROHIBIT = [
  "大型行李箱（輪子接觸地面）",
  "外食飲料帶入場內閱覽區",
  "強行推擠或插隊",
  "未經許可拍攝社團成員",
  "大聲喧嘩影響他人",
]

const FLOORS = [
  { area: "1F 東館", content: "一般向社團、同人誌、周邊商品" },
  { area: "1F 西館", content: "特別企劃、官方合作、主舞台" },
  { area: "B1 地下", content: "R18 社團（年齡確認入場）、同人遊戲" },
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

export default function AttendPage() {
  return (
    <PageShell titleEn="GENERAL ATTENDANCE" title="一般入場" subtitle="入場資訊、現場注意事項與購物小撇步">

      <motion.div {...fade(0)} className="grid grid-cols-4 gap-4 mb-8">
        {INFO.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl p-5" style={card}>
            <Icon size={16} className="mb-3" style={{ color: "#e8789a" }} />
            <div className="text-[10px] mb-1" style={{ color: "#9a8590" }}>{label}</div>
            <div className="text-sm font-black" style={{ color: "#1a0f14" }}>{value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#9a8590" }}>{sub}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-5 gap-5 mb-8">
        <motion.div {...fade(1)} className="col-span-3">
          <SectionTitle en="FLOOR GUIDE" zh="區域分佈" />
          <div className="flex flex-col gap-3">
            {FLOORS.map(({ area, content }) => (
              <div key={area} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={card}>
                <div className="text-xs font-black shrink-0 px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(232,120,154,0.1)", color: "#e8789a" }}>
                  {area}
                </div>
                <div className="text-sm" style={{ color: "#5a4550" }}>{content}</div>
              </div>
            ))}
            <div className="rounded-xl px-4 py-3 text-xs"
              style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", color: "#92400e" }}>
              ⚠ B1 區域需出示身分證件確認年齡（18歲以上）方可入場
            </div>
          </div>
        </motion.div>

        <motion.div {...fade(2)} className="col-span-2">
          <SectionTitle en="TIPS" zh="現場小撇步" />
          <div className="flex flex-col gap-3">
            {TIPS.map(({ title, desc }) => (
              <div key={title} className="flex gap-3 rounded-xl px-4 py-3" style={card}>
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: "#e8789a" }} />
                <div>
                  <div className="text-xs font-bold mb-0.5" style={{ color: "#1a0f14" }}>{title}</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: "#8a7a80" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div {...fade(3)}>
        <SectionTitle en="PROHIBITED" zh="禁止事項" />
        <div className="grid grid-cols-3 gap-3">
          {PROHIBIT.map(item => (
            <div key={item} className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "#fff5f5", border: "1px solid #fcd5d5" }}>
              <AlertTriangle size={12} className="shrink-0" style={{ color: "#f87171" }} />
              <span className="text-xs" style={{ color: "#5a4550" }}>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </PageShell>
  )
}
