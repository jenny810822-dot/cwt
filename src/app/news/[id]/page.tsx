import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.newsItem.findUnique({ where: { id: Number(id) } })
  if (!item || !item.published) notFound()

  const paragraphs = item.body
    ? item.body.split("\n\n").filter(Boolean)
    : []

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px]">

        {/* Header strip */}
        <div className="relative px-10 pt-12 pb-10 overflow-hidden" style={{ background: "#140810" }}>
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(232,120,154,0.06), transparent)" }}
          />
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs mb-6 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <ArrowLeft size={12} />
            最新消息
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.date}</span>
            {item.tag && (
              <span
                className="text-[9px] text-white px-2 py-0.5 rounded font-bold"
                style={{ background: item.tagColor ?? "#e8789a" }}
              >
                {item.tag}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-snug max-w-2xl" style={{ color: "white" }}>
            {item.title}
          </h1>
        </div>

        {/* Article body */}
        <div className="px-10 py-10 max-w-2xl">

          {/* Cover image */}
          {item.coverImage && (
            <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: "16/7" }}>
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Body */}
          {paragraphs.length > 0 ? (
            <div className="flex flex-col gap-5">
              {paragraphs.map((para, i) => {
                const isHeading = para.startsWith("【") && para.includes("】")
                if (isHeading && !para.includes("\n")) {
                  return (
                    <h2 key={i} className="text-sm font-black pt-2" style={{ color: "#1a0f14" }}>
                      {para}
                    </h2>
                  )
                }
                return (
                  <div key={i} className="flex flex-col gap-1.5">
                    {para.split("\n").map((line, j) => {
                      if (!line.trim()) return null
                      const isBullet = line.startsWith("・") || line.startsWith("✔") || line.startsWith("•")
                      return (
                        <p
                          key={j}
                          className="text-sm leading-relaxed"
                          style={{
                            color: isBullet ? "#5a4550" : "#3a2a30",
                            paddingLeft: isBullet ? "0.5rem" : undefined,
                          }}
                        >
                          {line}
                        </p>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "#8a7a80" }}>（本文尚無內容）</p>
          )}

          {/* Back link */}
          <div className="mt-12 pt-6" style={{ borderTop: "1px solid #f0e4ea" }}>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: "#e8789a" }}
            >
              <ArrowLeft size={12} />
              返回最新消息
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
