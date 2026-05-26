import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import NewsTable from "./NewsTable"

export default async function NewsPage() {
  const news = await prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } })
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>最新消息</h1>
          <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>管理首頁顯示的公告與消息</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: "#e8789a" }}
        >
          <Plus size={16} /> 新增消息
        </Link>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <NewsTable initialData={news} />
      </div>
    </div>
  )
}
