import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  upcoming: { label: "即將開放", color: "#a78bfa" },
  open:     { label: "報名中",   color: "#10b981" },
  closed:   { label: "已截止",   color: "#8a7a80" },
  full:     { label: "名額已滿", color: "#f59e0b" },
}

export default async function CircleAdminPage() {
  const items = await prisma.circleApplication.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>社團報名</h1>
          <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>管理各場次社團報名資訊</p>
        </div>
        <Link
          href="/admin/circle/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#e8789a" }}
        >
          <Plus size={16} /> 新增場次
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        {items.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#b0a0a8" }}>
            <p className="text-sm">尚無場次，點右上角新增</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f0e4ea" }}>
                {["場次名稱", "活動日期", "報名時間", "狀態", "上架", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "#9a8590" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const st = STATUS_LABELS[item.status] ?? { label: item.status, color: "#9a8590" }
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f8f0f4" }}>
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-semibold" style={{ color: "#1a0f14" }}>{item.title}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#9a8590" }}>CWT {item.edition} · {item.location}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#5a4550" }}>
                      {item.eventDateStart} — {item.eventDateEnd}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#5a4550" }}>
                      {item.regOpen || "—"}<br />
                      <span style={{ color: "#9a8590" }}>～ {item.regClose || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${st.color}18`, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: item.published ? "rgba(16,185,129,0.1)" : "rgba(160,160,160,0.1)", color: item.published ? "#10b981" : "#9a8590" }}>
                        {item.published ? "上架" : "草稿"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/circle/${item.id}`}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "#f8f0f4", color: "#8a7a80" }}>
                        <Pencil size={11} /> 編輯
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
