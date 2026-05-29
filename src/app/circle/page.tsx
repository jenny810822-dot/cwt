import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PageShell from "@/components/PageShell"
import { MapPin, Clock, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

const STATUS_META: Record<string, { label: string; color: string; order: number }> = {
  open:     { label: "報名中",   color: "#10b981", order: 0 },
  upcoming: { label: "即將開放", color: "#a78bfa", order: 1 },
  full:     { label: "名額已滿", color: "#f59e0b", order: 2 },
  closed:   { label: "已截止",   color: "#9a8590", order: 3 },
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${y}.${m}.${d}`
}

export default async function CirclePage() {
  const all = await prisma?.circleApplication?.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }).catch(() => null) ?? []

  const groups = Object.entries(STATUS_META)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([status, meta]) => ({
      status, meta,
      items: all.filter(i => i.status === status),
    }))
    .filter(g => g.items.length > 0)

  return (
    <PageShell titleEn="CIRCLE APPLICATION" title="社團報名" subtitle="各場次報名資訊、費用與注意事項">
      {all.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#b0a0a8" }}>
          <p className="text-sm">目前尚無開放場次</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 max-w-3xl">
          {groups.map(({ status, meta, items }) => (
            <section key={status}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                <span className="text-xs font-bold tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
                <div className="flex-1 h-px" style={{ background: "#f0e4ea" }} />
              </div>

              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <Link
                    key={item.id}
                    href={`/circle/${item.id}`}
                    className="group rounded-2xl overflow-hidden block transition-all"
                    style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 2px 10px rgba(232,120,154,0.06)" }}
                  >
                    <div className="h-1" style={{ background: meta.color }} />
                    <div className="px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${meta.color}18`, color: meta.color }}>
                              {meta.label}
                            </span>
                            <span className="text-[10px]" style={{ color: "#9a8590" }}>CWT {item.edition}</span>
                          </div>
                          <h3 className="text-sm font-bold leading-snug mb-3" style={{ color: "#1a0f14" }}>{item.title}</h3>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#6a5a60" }}>
                              <Clock size={11} style={{ color: "#c0a0b0" }} />
                              活動：{fmtDate(item.eventDateStart)} — {fmtDate(item.eventDateEnd)}
                            </div>
                            {item.venue && (
                              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#6a5a60" }}>
                                <MapPin size={11} style={{ color: "#c0a0b0" }} />
                                {item.venue}
                              </div>
                            )}
                            {item.regOpen && (
                              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#6a5a60" }}>
                                <span style={{ color: "#c0a0b0" }}>報名：</span>
                                {item.regOpen} — {item.regClose}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          {[
                            { label: "半桌", price: item.priceHalf },
                            { label: "全桌", price: item.priceFull },
                            { label: "大桌", price: item.priceLarge },
                          ].filter(p => p.price != null).map(p => (
                            <div key={p.label} className="text-[11px] mb-0.5" style={{ color: "#5a4550" }}>
                              <span style={{ color: "#9a8590" }}>{p.label} </span>
                              NT${p.price!.toLocaleString()}
                            </div>
                          ))}
                          <ChevronRight size={15} className="ml-auto mt-2 transition-transform group-hover:translate-x-0.5" style={{ color: "#c0a0b0" }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  )
}
