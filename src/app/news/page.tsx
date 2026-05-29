import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PageShell from "@/components/PageShell"
import { ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const news = await prisma.newsItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return (
    <PageShell titleEn="NEWS" title="最新消息" subtitle="活動公告、重要通知與最新資訊">
      <div className="max-w-2xl flex flex-col gap-3">
        {news.map(({ id, date, title, tag, tagColor, body }) => (
          <Link
            key={id}
            href={`/news/${id}`}
            className="rounded-2xl overflow-hidden group block transition-all"
            style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 2px 10px rgba(232,120,154,0.06)" }}
          >
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-medium" style={{ color: "#b0a0a8" }}>{date}</span>
                {tag && (
                  <span
                    className="text-[9px] text-white px-2 py-0.5 rounded font-bold"
                    style={{ background: tagColor ?? "#e8789a" }}
                  >
                    {tag}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold mb-1.5 leading-snug" style={{ color: "#1a0f14" }}>{title}</h3>
                  {body && (
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#6a5a60" }}>
                      {body.replace(/\n/g, " ")}
                    </p>
                  )}
                </div>
                <ChevronRight
                  size={15}
                  className="shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "#c0a0b0" }}
                />
              </div>
            </div>
          </Link>
        ))}

        {news.length === 0 && (
          <div className="text-center py-20" style={{ color: "#b0a0a8" }}>
            <p className="text-sm">目前尚無公告</p>
          </div>
        )}
      </div>
    </PageShell>
  )
}
