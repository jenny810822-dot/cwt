"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle, XCircle, Wallet, Undo2 } from "lucide-react"

type Reg = {
  id: number
  circleId: number
  tableType: string
  adjacentRequest: string
  note: string
  status: string
  createdAt: string
  circle: { name: string; leaderName: string; email: string; phone: string; genres: string } | null
}

type Event = {
  id: number; title: string; edition: number
  eventDateStart: string; eventDateEnd: string; venue: string
}

type PendingAction = {
  regId: number
  circleName: string
  newStatus: string
  label: string
}

const TABLE_LABELS: Record<string, string> = { half: "半桌", full: "全桌", large: "大桌" }

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending:  { label: "審核中", color: "#a78bfa" },
  approved: { label: "錄取",   color: "#10b981" },
  rejected: { label: "未錄取", color: "#9a8590" },
  paid:     { label: "已繳費", color: "#e8789a" },
}

// what status to revert to
const PREV_STATUS: Record<string, string | null> = {
  approved: "pending",
  rejected: "pending",
  paid: "approved",
}
const PREV_LABEL: Record<string, string> = {
  approved: "退回審核中",
  rejected: "退回審核中",
  paid: "退回錄取",
}

export default function CircleRegsPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [regs, setRegs] = useState<Reg[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "paid">("all")

  // confirmation modal
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [updating, setUpdating] = useState(false)

  // resend
  const [resending, setResending] = useState<number | null>(null)
  const [resendResult, setResendResult] = useState<Record<number, "ok" | "err">>({})

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/circle/${id}`).then(r => r.json()),
      fetch(`/api/admin/circle-regs?eventId=${id}`).then(r => r.json()),
    ]).then(([ev, rs]) => {
      setEvent(ev)
      setRegs(Array.isArray(rs) ? rs : [])
      setLoading(false)
    })
  }, [id])

  function requestAction(reg: Reg, newStatus: string, label: string) {
    setPendingAction({ regId: reg.id, circleName: reg.circle?.name ?? `社團 #${reg.circleId}`, newStatus, label })
  }

  async function confirmAction() {
    if (!pendingAction) return
    setUpdating(true)
    const res = await fetch("/api/admin/circle-regs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pendingAction.regId, status: pendingAction.newStatus }),
    })
    if (res.ok) {
      setRegs(prev => prev.map(r => r.id === pendingAction.regId ? { ...r, status: pendingAction.newStatus } : r))
    }
    setUpdating(false)
    setPendingAction(null)
  }

  async function resendMail(reg: Reg) {
    setResending(reg.id)
    const res = await fetch(`/api/admin/circle-regs/${reg.id}/resend`, { method: "POST" })
    setResendResult(prev => ({ ...prev, [reg.id]: res.ok ? "ok" : "err" }))
    setResending(null)
    setTimeout(() => setResendResult(prev => { const n = { ...prev }; delete n[reg.id]; return n }), 3000)
  }

  const filtered = filter === "all" ? regs : regs.filter(r => r.status === filter)
  const counts = { all: regs.length, pending: 0, approved: 0, rejected: 0, paid: 0 }
  regs.forEach(r => { if (r.status in counts) counts[r.status as keyof typeof counts]++ })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/circle" className="inline-flex items-center gap-1.5 text-xs mb-4"
          style={{ color: "#9a8590" }}>
          <ArrowLeft size={12} /> 返回場次列表
        </Link>
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>
          {event ? event.title : "載入中…"}
        </h1>
        {event && (
          <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>
            {event.eventDateStart} — {event.eventDateEnd} · {event.venue}
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", "pending", "approved", "paid", "rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ background: filter === f ? "#1a0f14" : "#f0e8ec", color: filter === f ? "white" : "#5a4550" }}>
            {f === "all" ? "全部" : STATUS_META[f]?.label}
            <span className="ml-1.5 opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm" style={{ color: "#9a8590" }}>載入中…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "white", color: "#b0a0a8" }}>
          <p className="text-sm">此場次目前無報名</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(reg => {
            const st = STATUS_META[reg.status] ?? STATUS_META.pending
            const prevStatus = PREV_STATUS[reg.status]
            return (
              <div key={reg.id} className="rounded-2xl p-5"
                style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <div className="flex items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: "#1a0f14" }}>
                        {reg.circle?.name ?? `社團 #${reg.circleId}`}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${st.color}18`, color: st.color }}>{st.label}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(167,139,250,0.1)", color: "#7c3aed" }}>
                        {TABLE_LABELS[reg.tableType] ?? reg.tableType}
                      </span>
                    </div>
                    <div className="text-xs mb-1.5" style={{ color: "#8a7a80" }}>
                      {reg.circle?.leaderName} · {reg.circle?.email} · {reg.circle?.phone}
                    </div>
                    {reg.circle?.genres && (
                      <div className="text-xs" style={{ color: "#9a8590" }}>
                        <span style={{ color: "#b0a0a8" }}>類型：</span>{reg.circle.genres}
                      </div>
                    )}
                    {reg.adjacentRequest && (
                      <div className="text-xs" style={{ color: "#9a8590" }}>
                        <span style={{ color: "#b0a0a8" }}>連攤：</span>{reg.adjacentRequest}
                      </div>
                    )}
                    {reg.note && (
                      <div className="text-xs" style={{ color: "#9a8590" }}>
                        <span style={{ color: "#b0a0a8" }}>備註：</span>{reg.note}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                    <div className="flex gap-2 flex-wrap justify-end">
                      {reg.status === "pending" && <>
                        <button onClick={() => requestAction(reg, "approved", "錄取")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                          <CheckCircle size={11} /> 錄取
                        </button>
                        <button onClick={() => requestAction(reg, "rejected", "未錄取")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: "rgba(156,163,175,0.1)", color: "#6b7280" }}>
                          <XCircle size={11} /> 未錄取
                        </button>
                      </>}
                      {reg.status === "approved" && (
                        <button onClick={() => requestAction(reg, "paid", "確認繳費")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: "rgba(232,120,154,0.1)", color: "#e8789a" }}>
                          <Wallet size={11} /> 確認繳費
                        </button>
                      )}
                      {prevStatus && (
                        <button onClick={() => requestAction(reg, prevStatus, PREV_LABEL[reg.status])}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: "#f0e8ec", color: "#8a7a80" }}>
                          <Undo2 size={11} /> {PREV_LABEL[reg.status]}
                        </button>
                      )}
                    </div>
                    <button onClick={() => resendMail(reg)}
                      disabled={resending === reg.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: resendResult[reg.id] === "ok" ? "rgba(16,185,129,0.1)"
                          : resendResult[reg.id] === "err" ? "rgba(239,68,68,0.1)" : "#f0e8ec",
                        color: resendResult[reg.id] === "ok" ? "#10b981"
                          : resendResult[reg.id] === "err" ? "#ef4444" : "#5a4550",
                      }}>
                      <Mail size={11} />
                      {resending === reg.id ? "寄送中…"
                        : resendResult[reg.id] === "ok" ? "已寄出 ✓"
                        : resendResult[reg.id] === "err" ? "寄送失敗"
                        : "補寄通知信"}
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 text-[10px]" style={{ borderTop: "1px solid #f8f0f4", color: "#b0a0a8" }}>
                  報名時間：{new Date(reg.createdAt).toLocaleString("zh-TW")}
                </div>
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
          <div className="rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl"
            style={{ background: "white" }}>
            <h3 className="text-base font-black mb-2" style={{ color: "#1a0f14" }}>確認操作</h3>
            <p className="text-sm mb-1" style={{ color: "#5a4550" }}>
              確定要將 <strong>{pendingAction.circleName}</strong> 改為
            </p>
            <p className="text-lg font-black mb-5"
              style={{ color: STATUS_META[pendingAction.newStatus]?.color ?? "#1a0f14" }}>
              {STATUS_META[pendingAction.newStatus]?.label ?? pendingAction.label}
            </p>
            <div className="flex gap-3">
              <button onClick={confirmAction} disabled={updating}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: updating ? "rgba(232,120,154,0.4)" : "#e8789a" }}>
                {updating ? "處理中…" : "確認"}
              </button>
              <button onClick={() => setPendingAction(null)} disabled={updating}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
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
