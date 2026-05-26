"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import type { NewsItem } from "@/generated/prisma"

export default function NewsTable({ initialData }: { initialData: NewsItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initialData)
  const [deleting, setDeleting] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!confirm("確定要刪除這則消息？")) return
    setDeleting(id)
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" })
    setItems(prev => prev.filter(i => i.id !== id))
    setDeleting(null)
    router.refresh()
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "#9a8590" }}>
        <div className="text-sm">尚無消息</div>
        <Link href="/admin/news/new" className="text-xs mt-2 inline-block" style={{ color: "#e8789a" }}>
          新增第一則 →
        </Link>
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr style={{ borderBottom: "1px solid #f0e8ec" }}>
          {["日期", "標題", "標籤", "狀態", "操作"].map(h => (
            <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold tracking-wider"
              style={{ color: "#9a8590" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}
            className="transition-colors"
            style={{ borderBottom: "1px solid #f5f0f2" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fdf8fa")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <td className="px-5 py-3.5 text-sm" style={{ color: "#8a7a80", width: 80 }}>{item.date}</td>
            <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "#1a0f14" }}>{item.title}</td>
            <td className="px-5 py-3.5" style={{ width: 80 }}>
              {item.tag && (
                <span
                  className="text-[9px] text-white px-2 py-0.5 rounded font-bold"
                  style={{ background: item.tagColor ?? "#e8789a" }}
                >
                  {item.tag}
                </span>
              )}
            </td>
            <td className="px-5 py-3.5" style={{ width: 80 }}>
              <span
                className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: item.published ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.1)",
                  color: item.published ? "#16a34a" : "#6b7280",
                }}
              >
                {item.published ? "已發布" : "草稿"}
              </span>
            </td>
            <td className="px-5 py-3.5" style={{ width: 100 }}>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/news/${item.id}`}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "#8a7a80" }}
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: deleting === item.id ? "#c0a0a8" : "#ef4444" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
