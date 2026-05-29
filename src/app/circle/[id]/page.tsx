import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { ArrowLeft, MapPin, Clock, CalendarDays } from "lucide-react"

export const dynamic = "force-dynamic"

const STATUS_META: Record<string, { label: string; color: string }> = {
  open:     { label: "報名中",   color: "#10b981" },
  upcoming: { label: "即將開放", color: "#a78bfa" },
  full:     { label: "名額已滿", color: "#f59e0b" },
  closed:   { label: "已截止",   color: "#9a8590" },
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${y}.${m}.${d}`
}

export default async function CircleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma?.circleApplication?.findUnique({ where: { id: Number(id) } }).catch(() => null)
  if (!item || !item.published) notFound()

  const st = STATUS_META[item.status] ?? { label: item.status, color: "#9a8590" }
  const prices = [
    { label: "半桌（約 45cm）", price: item.priceHalf },
    { label: "全桌（約 90cm）", price: item.priceFull },
    { label: "大桌（約 180cm）", price: item.priceLarge },
  ].filter(p => p.price != null)

  const isHtml = item.description?.trimStart().startsWith("<")

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px]">

        {/* Header */}
        <div className="relative px-10 pt-12 pb-10 overflow-hidden" style={{ background: "#140810" }}>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(232,120,154,0.06), transparent)" }} />
          <Link href="/circle" className="inline-flex items-center gap-1.5 text-xs mb-6 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={12} /> 社團報名
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${st.color}22`, color: st.color }}>
              {st.label}
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>CWT {item.edition}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-snug max-w-2xl" style={{ color: "white" }}>
            {item.title}
          </h1>
        </div>

        <div className="px-10 py-10 w-full">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Info sidebar */}
            <div className="lg:w-64 flex-shrink-0 flex flex-col gap-4">

              {/* Event info */}
              <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #f0e4ea" }}>
                <div className="text-[10px] font-bold tracking-widest mb-4" style={{ color: "#b0a0a8" }}>活動資訊</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <CalendarDays size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#e8789a" }} />
                    <div>
                      <div className="text-[10px]" style={{ color: "#9a8590" }}>活動日期</div>
                      <div className="text-sm font-semibold" style={{ color: "#1a0f14" }}>
                        {fmtDate(item.eventDateStart)} — {fmtDate(item.eventDateEnd)}
                      </div>
                    </div>
                  </div>
                  {item.venue && (
                    <div className="flex items-start gap-2.5">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#e8789a" }} />
                      <div>
                        <div className="text-[10px]" style={{ color: "#9a8590" }}>場館</div>
                        <div className="text-sm font-semibold" style={{ color: "#1a0f14" }}>{item.venue}</div>
                      </div>
                    </div>
                  )}
                  {item.regOpen && (
                    <div className="flex items-start gap-2.5">
                      <Clock size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#e8789a" }} />
                      <div>
                        <div className="text-[10px]" style={{ color: "#9a8590" }}>報名時間</div>
                        <div className="text-sm font-semibold" style={{ color: "#1a0f14" }}>{item.regOpen}</div>
                        <div className="text-sm font-semibold" style={{ color: "#1a0f14" }}>— {item.regClose}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Prices */}
              {prices.length > 0 && (
                <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #f0e4ea" }}>
                  <div className="text-[10px] font-bold tracking-widest mb-4" style={{ color: "#b0a0a8" }}>報名費用</div>
                  <div className="flex flex-col gap-3">
                    {prices.map(p => (
                      <div key={p.label} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: "#6a5a60" }}>{p.label}</span>
                        <span className="text-sm font-black" style={{ color: "#e8789a" }}>
                          NT${p.price!.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex-1 min-w-0">
              {item.description ? (
                isHtml ? (
                  <div className="article-prose" dangerouslySetInnerHTML={{ __html: item.description }} />
                ) : (
                  <div className="article-prose">
                    {item.description.split("\n\n").filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-sm" style={{ color: "#8a7a80" }}>（尚無詳細說明）</p>
              )}

              <div className="mt-12 pt-6" style={{ borderTop: "1px solid #f0e4ea" }}>
                <Link href="/circle" className="inline-flex items-center gap-2 text-xs font-medium hover:opacity-80"
                  style={{ color: "#e8789a" }}>
                  <ArrowLeft size={12} /> 返回社團報名
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
