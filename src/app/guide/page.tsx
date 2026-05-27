"use client"
import { motion } from "framer-motion"
import PageShell from "@/components/PageShell"
import { BookOpen, Users, ShoppingBag, Map, HelpCircle, Sparkles } from "lucide-react"

const STEPS = [
  { icon: Map, title: "查詢活動資訊", desc: "確認活動日期、地點與開放時間，提前規劃交通路線。", color: "#e8789a" },
  { icon: BookOpen, title: "購買場刊", desc: "場刊為社團索引，可提前了解攤位分佈，快速找到想去的社團。", color: "#a78bfa" },
  { icon: Map, title: "規劃攤位路線", desc: "依場刊標記想逛的攤位，安排合理動線，避免重複折返。", color: "#10b981" },
  { icon: ShoppingBag, title: "備好購物準備", desc: "攜帶足夠現金（含零錢）、購物袋，以及身分證件（B1 區域需要）。", color: "#f59e0b" },
  { icon: Users, title: "享受現場！", desc: "保持禮貌與耐心，和喜歡的社團聊聊，這是次文化最美好的相遇。", color: "#e8789a" },
]

const VOCAB = [
  { term: "社團", def: "同人活動的攤位單位，由個人或小組組成，販售自製作品。" },
  { term: "場刊", def: "官方發行的活動手冊，收錄所有社團資訊與場地地圖。" },
  { term: "戰利品", def: "在活動現場購買的商品，為同人文化常見用語。" },
  { term: "R18", def: "限定 18 歲以上閱覽的成人向作品區域，需驗證身分。" },
  { term: "CP", def: "Character Pairing 縮寫，指特定角色配對的同人創作。" },
  { term: "全年齡", def: "老少咸宜的作品分級，無年齡限制即可入場購買。" },
]

const FAQS = [
  { q: "第一次來要怎麼準備？", a: "建議購買場刊提前規劃，攜帶現金、環保袋，提早入場以免熱門攤位售完。" },
  { q: "可以攜帶未成年者入場嗎？", a: "一般向（1F）可帶未成年者，B1 R18 區需持身分證確認年齡 18 歲以上。" },
  { q: "信用卡可以用嗎？", a: "大部分社團只接受現金，少數社團提供電子支付，建議以現金為主。" },
  { q: "東西可以寄放嗎？", a: "現場設有付費置物區，建議自備輕便購物袋分批採購。" },
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

export default function GuidePage() {
  return (
    <PageShell titleEn="BEGINNER'S GUIDE" title="新手上路" subtitle="第一次參加 CWT？這裡是你需要知道的一切">

      {/* What is CWT */}
      <motion.div {...fade(0)} className="rounded-2xl p-6 mb-8 flex gap-4"
        style={{ background: "rgba(232,120,154,0.06)", border: "1px solid rgba(232,120,154,0.18)" }}>
        <Sparkles size={18} className="shrink-0 mt-0.5" style={{ color: "#e8789a" }} />
        <div>
          <h3 className="text-sm font-black mb-1.5" style={{ color: "#1a0f14" }}>什麼是 CWT？</h3>
          <p className="text-sm leading-relaxed" style={{ color: "#5a4550" }}>
            CWT（Comic World Taiwan）是台灣規模最大的同人誌販售會，由同人創作者自由參展，販售漫畫、小說、插畫、周邊等原創與二次創作作品。每年舉辦多場，是次文化愛好者交流與購物的重要場合。
          </p>
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div {...fade(1)} className="mb-8">
        <SectionTitle en="FIRST VISIT" zh="第一次參加的 5 個步驟" />
        <div className="grid grid-cols-5 gap-3">
          {STEPS.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={title} className="rounded-2xl p-5" style={card}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${color}15` }}>
                <Icon size={13} style={{ color }} />
              </div>
              <div className="text-xl font-black mb-2 leading-none" style={{ color: `${color}40` }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-xs font-black mb-1" style={{ color: "#1a0f14" }}>{title}</div>
              <div className="text-[11px] leading-relaxed" style={{ color: "#8a7a80" }}>{desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-5">
        {/* Vocabulary */}
        <motion.div {...fade(2)}>
          <SectionTitle en="GLOSSARY" zh="常見用語" />
          <div className="flex flex-col gap-2">
            {VOCAB.map(({ term, def }) => (
              <div key={term} className="flex gap-3 rounded-xl px-4 py-3" style={card}>
                <span className="text-xs font-black shrink-0 w-10" style={{ color: "#e8789a" }}>{term}</span>
                <span className="text-xs leading-relaxed" style={{ color: "#5a4550" }}>{def}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div {...fade(3)}>
          <SectionTitle en="FAQ" zh="常見問題" />
          <div className="flex flex-col gap-3">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl px-5 py-4" style={card}>
                <div className="flex items-start gap-2 mb-2">
                  <HelpCircle size={13} className="shrink-0 mt-0.5" style={{ color: "#e8789a" }} />
                  <span className="text-xs font-bold" style={{ color: "#1a0f14" }}>{q}</span>
                </div>
                <p className="text-xs leading-relaxed pl-5" style={{ color: "#6a5a60" }}>{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </PageShell>
  )
}
