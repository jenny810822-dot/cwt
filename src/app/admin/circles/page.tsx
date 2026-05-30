"use client"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, Mail } from "lucide-react"

type Circle = {
  id: number; name: string; leaderName: string; email: string; phone: string
  type: string; region: string; genres: string; portfolioUrl: string; snsUrl: string; note: string
  status: string; createdAt: string
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending:  { label: "待審核", color: "#a78bfa" },
  approved: { label: "已通過", color: "#10b981" },
  rejected: { label: "已拒絕", color: "#9a8590" },
  // 退回用
  revert:   { label: "退回待審核", color: "#8a7a80" },
}

type PendingAction = { id: number; name: string; status: string }

export default function AdminCirclesPage() {
  const [circles, setCircles] = useState<Circle[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [resending, setResending] = useState<number | null>(null)
  const [resendResult, setResendResult] = useState<Record<number, "ok" | "err">>({})
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [updating, setUpdating] = useState(false)

  async function resendMail(id: number) {
    setResending(id)
    const res = await fetch(`/api/admin/circles/${id}/resend`, { method: "POST" })
    setResendResult(prev => ({ ...prev, [id]: res.ok ? "ok" : "err" }))
    setResending(null)
    setTimeout(() => setResendResult(prev => { const n = { ...prev }; delete n[id]; return n }), 3000)
  }

  useEffect(() => {
    fetch("/api/admin/circles").then(r => r.json()).then(data => {
      setCircles(data)
      setLoading(false)
    })
  }, [])

  async function confirmAction() {
    if (!pendingAction) return
    setUpdating(true)
    const res = await fetch(`/api/admin/circles/${pendingAction.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: pendingAction.status }),
    })
    if (res.ok) {
      setCircles(prev => prev.map(c => c.id === pendingAction.id ? { ...c, status: pendingAction.status } : c))
    }
    setUpdating(false)
    setPendingAction(null)
  }

  const filtered = filter === "all" ? circles : circles.filter(c => c.status === filter)
  const counts = {
    all: circles.length,
    pending: circles.filter(c => c.status === "pending").length,
    approved: circles.filter(c => c.status === "approved").length,
    rejected: circles.filter(c => c.status === "rejected").length,
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>社團帳號審核</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>審核社團帳號申請，通過後可報名場次</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["pending", "approved", "rejected", "all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === f ? "#1a0f14" : "#f0e8ec",
              color: filter === f ? "white" : "#5a4550",
            }}>
            {f === "pending" ? "待審核" : f === "approved" ? "已通過" : f === "rejected" ? "已拒絕" : "全部"}
            <span className="ml-1.5 opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "#9a8590" }}>載入中…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "white", color: "#b0a0a8" }}>
          <p className="text-sm">目前無{filter === "pending" ? "待審核" : ""}社團</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(c => {
            const st = STATUS_META[c.status] ?? STATUS_META.pending
            const isOpen = expanded === c.id
            return (
              <div key={c.id} className="rounded-2xl overflow-hidden"
                style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                {/* Row header */}
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <span className="text-sm font-bold" style={{ color: "#1a0f14" }}>{c.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${st.color}18`, color: st.color }}>{st.label}</span>
                      <span className="text-[10px]" style={{ color: "#b0a0a8" }}>
                        {c.type === "doujin" ? "同人社" : "代理攤"}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: c.region === "overseas" ? "#fef3c7" : "#e0f2fe", color: c.region === "overseas" ? "#92400e" : "#0369a1" }}>
                        {c.region === "overseas" ? "海外" : "台灣"}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "#8a7a80" }}>
                      {c.leaderName} · {c.email} · {c.phone}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.status !== "approved" && (
                      <button onClick={() => setPendingAction({ id: c.id, name: c.name, status: "approved" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                        <CheckCircle size={12} /> 通過
                      </button>
                    )}
                    {c.status !== "rejected" && (
                      <button onClick={() => setPendingAction({ id: c.id, name: c.name, status: "rejected" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "rgba(156,163,175,0.1)", color: "#6b7280" }}>
                        <XCircle size={12} /> 拒絕
                      </button>
                    )}
                    {c.status !== "pending" && (
                      <button onClick={() => setPendingAction({ id: c.id, name: c.name, status: "pending" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "#f0e8ec", color: "#8a7a80" }}>
                        ↩ 退回
                      </button>
                    )}
                    <button onClick={() => setExpanded(isOpen ? null : c.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ background: "#f8f0f4", color: "#8a7a80" }}>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-1" style={{ borderTop: "1px solid #f8f0f4" }}>
                    <dl className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                      {[
                        { k: "創作類型", v: c.genres || "—" },
                        { k: "申請地區", v: c.region === "overseas" ? "海外" : "台灣國內" },
                        { k: "申請日期", v: new Date(c.createdAt).toLocaleDateString("zh-TW") },
                        { k: "備註", v: c.note || "—" },
                      ].map(({ k, v }) => (
                        <div key={k}>
                          <dt className="text-[10px] font-semibold mb-0.5" style={{ color: "#9a8590" }}>{k}</dt>
                          <dd style={{ color: "#1a0f14" }}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {c.portfolioUrl && (
                        <a href={c.portfolioUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: "#e8789a" }}>
                          <ExternalLink size={11} /> 作品連結
                        </a>
                      )}
                      {c.snsUrl && (
                        <a href={c.snsUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: "#e8789a" }}>
                          <ExternalLink size={11} /> SNS
                        </a>
                      )}
                      <div className="ml-auto">
                        <button
                          onClick={() => resendMail(c.id)}
                          disabled={resending === c.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          style={{
                            background: resendResult[c.id] === "ok" ? "rgba(16,185,129,0.1)"
                              : resendResult[c.id] === "err" ? "rgba(239,68,68,0.1)"
                              : "#f0e8ec",
                            color: resendResult[c.id] === "ok" ? "#10b981"
                              : resendResult[c.id] === "err" ? "#ef4444"
                              : "#5a4550",
                          }}>
                          <Mail size={11} />
                          {resending === c.id ? "寄送中…"
                            : resendResult[c.id] === "ok" ? "已寄出 ✓"
                            : resendResult[c.id] === "err" ? "寄送失敗"
                            : "補寄通知信"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Confirmation modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(20,8,16,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget && !updating) setPendingAction(null) }}>
          <div className="rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl" style={{ background: "white" }}>
            <h3 className="text-base font-black mb-2" style={{ color: "#1a0f14" }}>確認操作</h3>
            <p className="text-sm mb-1" style={{ color: "#5a4550" }}>
              確定要將 <strong>{pendingAction.name}</strong> 改為
            </p>
            <p className="text-lg font-black mb-5"
              style={{ color: STATUS_META[pendingAction.status]?.color ?? "#1a0f14" }}>
              {STATUS_META[pendingAction.status]?.label ?? pendingAction.status}
            </p>
            <div className="flex gap-3">
              <button onClick={confirmAction} disabled={updating}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: updating ? "rgba(232,120,154,0.4)" : "#e8789a" }}>
                {updating ? "處理中…" : "確認"}
              </button>
              <button onClick={() => setPendingAction(null)} disabled={updating}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#f0e8ec", color: "#5a4550" }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
