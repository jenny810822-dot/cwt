"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageShell from "@/components/PageShell"
import { ChevronDown, Ticket, ShoppingBag, Users, Shirt, AlertTriangle, MapPin } from "lucide-react"

const CATEGORIES = [
  {
    icon: Ticket,
    title: "入場相關",
    color: "#e8789a",
    bg: "rgba(232,120,154,0.08)",
    faqs: [
      {
        q: "入場需要購票嗎？",
        a: "一般參加者免費入場，無需購票。現場會販售場刊（約 NT$100），內含所有社團資訊與場地地圖，強烈建議購買以便規劃動線。",
      },
      {
        q: "活動幾點開始、幾點結束？",
        a: "通常為 10:30 開放入場，16:30 結束。部分場次末段會開放清場，建議 16:00 前完成採購。確切時間以當屆官方公告為準。",
      },
      {
        q: "需要事先預約或排號嗎？",
        a: "一般入場不需要預約，直接到現場排隊即可。若想入場熱門社團，建議提早 30–60 分鐘抵達。部分特別企劃或簽名會活動可能另有排號規則，請留意官方公告。",
      },
      {
        q: "可以帶小朋友或未成年者入場嗎？",
        a: "1F 一般向區域歡迎各年齡層入場，未成年者可在家長陪同下自由參觀。B1 R18 區域則需出示身分證件確認年滿 18 歲，未成年者嚴禁進入。",
      },
      {
        q: "可以重複進出場嗎？",
        a: "可以。入場後離場再入場通常不受限制，但建議向現場工作人員確認當天規則，部分場次可能有蓋章或手環機制。",
      },
    ],
  },
  {
    icon: ShoppingBag,
    title: "購物指南",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    faqs: [
      {
        q: "場內可以刷卡或使用電子支付嗎？",
        a: "大部分社團以現金交易為主。雖然近年少數社團開始接受 LINE Pay、街口支付等行動支付，但比例仍低。建議攜帶足夠現金（含零錢），以免錯過想買的作品。",
      },
      {
        q: "附近有 ATM 嗎？",
        a: "台大體育館周邊有部分便利商店及銀行 ATM，但活動當天人潮眾多，建議提前領好現金再入場。",
      },
      {
        q: "可以帶行李箱入場嗎？",
        a: "基於安全及動線考量，禁止攜帶輪子接觸地面的大型行李箱入場。建議改用大容量後背包、手提袋或折疊式購物推車（輪子較小且不影響動線）。",
      },
      {
        q: "社團作品可以先網路預訂再現場取貨嗎？",
        a: "部分社團會在活動前開放網路預購或預約，請直接聯繫各社團的官方 SNS（Twitter/X、Instagram 等）查詢。CWT 官方並未提供統一的預購系統。",
      },
      {
        q: "買到的東西可以寄放嗎？",
        a: "現場通常設有付費寄放服務，費用與位置以當屆公告為準。若擔心東西太多，也可分批採購後暫時放到場外再回來繼續逛。",
      },
    ],
  },
  {
    icon: Users,
    title: "社團報名",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    faqs: [
      {
        q: "誰可以報名參展？",
        a: "只要是同人創作者或同好團體，均可報名。作品須為原創或基於現有作品的二次創作，並依規定分級（全年齡／R18）。商業出版品及非自製商品不得販售。",
      },
      {
        q: "報名後可以取消或轉讓桌位嗎？",
        a: "報名費繳交後原則上不退款。桌位轉讓需透過官方管道申請，嚴禁私下轉讓。若確有不可抗力因素，請直接聯繫主辦單位說明。",
      },
      {
        q: "一個人可以報名多張桌位嗎？",
        a: "通常每個報名單位以一張桌位為限。若有需要更大展示空間，可申請大桌方案，或與其他社團合桌（需雙方於報名時說明）。",
      },
      {
        q: "R18 作品如何申報？",
        a: "報名時需勾選作品分級。R18 社團將安排至 B1 限定區域，並設有年齡確認機制。所有 R18 作品需有明確標示，並放置於不對外展示的位置，僅對年齡確認通過的參觀者展示。",
      },
      {
        q: "沒有抽到桌位怎麼辦？",
        a: "若報名人數超過桌位數量，主辦單位將以抽籤或審核方式決定。未抽中的社團通常會列入候補名單，有缺額時依序補入。建議持續關注官方公告。",
      },
    ],
  },
  {
    icon: Shirt,
    title: "Cosplay",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    faqs: [
      {
        q: "可以穿 Cosplay 入場嗎？",
        a: "歡迎穿著 Cosplay 參加！請於場館指定更衣室換裝，勿在廁所或公共空間換裝。入場服裝需符合基本公共場所規範。",
      },
      {
        q: "Cosplay 道具有什麼限制？",
        a: "刀劍等仿真武器道具須為非金屬材質，且刀刃部分需做安全處理（包布或塑膠材質）。超過 1 公尺的大型道具需事先向主辦單位申請許可。仿真槍械、爆裂物造型等危險外觀道具一律禁止。",
      },
      {
        q: "可以在場內拍攝 Cosplay 照片嗎？",
        a: "可以，但拍攝前請務必取得對方同意。若對方拒絕拍攝，請立即停止並尊重其意願。場內有指定拍攝區，建議前往該區域進行較正式的拍攝，以免阻礙人流。",
      },
      {
        q: "全身裸露或性感服裝可以穿嗎？",
        a: "過度暴露（包含裸胸、裸臀）的服裝不得穿著入場。露肚裝、低胸裝等一般性感服裝視情況可接受，若工作人員認定不妥，將請當事人至更衣室加穿遮蔽。",
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: "R18 區域",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.07)",
    faqs: [
      {
        q: "R18 區域在哪裡？如何入場？",
        a: "R18 社團統一安排在 B1 地下樓層，入口處設有年齡驗證關卡。需出示身分證、護照或其他附照片之官方證件，確認年滿 18 歲後方可入場，未滿 18 歲一律謝絕。",
      },
      {
        q: "R18 作品的定義為何？",
        a: "包含露骨性描寫、裸露、或高度暴力的漫畫、小說、插畫及周邊商品均屬 R18 範疇。各社團需自行判斷作品分級並如實申報，若被認定分級錯誤，主辦單位有權要求移至 B1 區域或停止販售。",
      },
      {
        q: "可以帶 R18 作品到 1F 展示嗎？",
        a: "不行。所有 R18 作品及周邊均需限制在 B1 展示與販售，不得帶至 1F 展示。若在 1F 攤位發現未申報的 R18 作品，主辦單位將要求立即撤除。",
      },
    ],
  },
  {
    icon: MapPin,
    title: "交通 & 場地",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.07)",
    faqs: [
      {
        q: "怎麼搭大眾運輸到台大體育館？",
        a: "捷運公館站（綠線）2 號出口步行約 8–10 分鐘。亦可搭乘公車至「台灣大學」站下車。活動當天建議搭乘大眾運輸，周邊停車位極為有限。",
      },
      {
        q: "有停車場嗎？",
        a: "台大校園內及周邊有少量停車位，但活動當天幾乎全滿。強烈建議搭乘捷運或公車，或在較遠處停車後步行。自行車可停放於校門口附近的機車停車格。",
      },
      {
        q: "場內有餐飲區嗎？",
        a: "場館內通常不提供飲食販售，也禁止外帶飲食入場（礦泉水除外）。周邊有多家餐廳及便利商店，可在入場前或離場後用餐。",
      },
      {
        q: "場地內有哺乳室或無障礙設施嗎？",
        a: "台大綜合體育館設有電梯及無障礙廁所。哺乳室位置請於入場後詢問工作人員，或留意場內指示標誌。如有特殊需求，歡迎事先聯繫主辦單位協助安排。",
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: "white", border: `1px solid ${open ? "#f0c8d8" : "#f0e4ea"}`, boxShadow: open ? "0 2px 12px rgba(232,120,154,0.08)" : "none" }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold leading-snug" style={{ color: "#1a0f14" }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-0.5">
          <ChevronDown size={15} style={{ color: "#c0a0b0" }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#6a5a60", borderTop: "1px solid #fdf0f4" }}>
              <div className="pt-3">{a}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  return (
    <PageShell titleEn="FAQ" title="常見問題" subtitle="活動相關的各類疑問，在這裡找到解答">
      <div className="max-w-3xl">
        {CATEGORIES.map(({ icon: Icon, title, color, bg, faqs }, ci) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.07 * ci }}
            className="mb-8"
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={14} style={{ color }} />
              </div>
              <h2 className="text-sm font-black" style={{ color: "#1a0f14" }}>{title}</h2>
              <div className="flex-1 h-px" style={{ background: "#f0e4ea" }} />
              <span className="text-[10px] font-medium" style={{ color: "#b0a0a8" }}>{faqs.length} 則</span>
            </div>

            <div className="flex flex-col gap-2">
              {faqs.map(({ q, a }) => (
                <FAQItem key={q} q={q} a={a} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Contact fallback */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07 * CATEGORIES.length }}
          className="rounded-2xl px-6 py-5 flex items-start gap-4"
          style={{ background: "rgba(232,120,154,0.06)", border: "1px solid rgba(232,120,154,0.18)" }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,120,154,0.12)" }}>
            <span style={{ fontSize: 14 }}>💬</span>
          </div>
          <div>
            <div className="text-sm font-black mb-1" style={{ color: "#1a0f14" }}>找不到你要的答案？</div>
            <p className="text-xs leading-relaxed" style={{ color: "#6a5a60" }}>
              以上未涵蓋的問題，歡迎透過官方 Instagram、Twitter/X 或 Facebook 粉絲專頁私訊詢問，工作人員將盡快回覆。請勿透過非官方管道詢問，以免收到錯誤資訊。
            </p>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
