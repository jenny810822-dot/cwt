"use client"
import { useState, useEffect } from "react"
import { UserPlus, Trash2, Shield, Pencil } from "lucide-react"

interface Member { id: number; name: string; email: string; role: string; createdAt: string }

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/members").then(r => r.json()).then(setMembers)
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/admin/members", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    })
    const newMember = await res.json()
    setMembers(prev => [...prev, newMember])
    setForm({ name: "", email: "", password: "", role: "editor" })
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`確定要移除 ${name}？`)) return
    await fetch(`/api/admin/members/${id}`, { method: "DELETE" })
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  async function toggleRole(member: Member) {
    const newRole = member.role === "admin" ? "editor" : "admin"
    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: newRole }),
    })
    const updated = await res.json()
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>成員管理</h1>
          <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>管理後台帳號與權限</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#e8789a" }}>
          <UserPlus size={15} /> 新增成員
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="rounded-2xl p-5 mb-5 grid grid-cols-2 gap-4"
          style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
        >
          <div className="col-span-2">
            <div className="h-1 -mx-5 -mt-5 mb-4 rounded-t-2xl" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />
            <span className="text-sm font-bold" style={{ color: "#1a0f14" }}>新增後台成員</span>
          </div>
          {[
            { key: "name", label: "姓名", placeholder: "王小明" },
            { key: "email", label: "電子郵件", placeholder: "user@cwt.tw" },
            { key: "password", label: "初始密碼", placeholder: "••••••••", type: "password" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-[11px] font-semibold block mb-1.5" style={{ color: "#5a4550" }}>{label}</label>
              <input type={type ?? "text"} value={form[key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder} required
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                onFocus={e => (e.target.style.borderColor = "#e8789a")}
                onBlur={e => (e.target.style.borderColor = "#f0e4ea")} />
            </div>
          ))}
          <div>
            <label className="text-[11px] font-semibold block mb-1.5" style={{ color: "#5a4550" }}>權限</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}>
              <option value="editor">編輯者</option>
              <option value="admin">管理員</option>
            </select>
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#e8789a" }}>
              {saving ? "新增中…" : "確認新增"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#f0e8ec", color: "#5a4550" }}>
              取消
            </button>
          </div>
        </form>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
      >
        <div className="h-1" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />
        <table className="w-full">
          <thead>
            <tr style={{ background: "#fdf8fa", borderBottom: "1px solid #f0e4ea" }}>
              {["成員", "電子郵件", "權限", "加入日期", "操作"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold tracking-wider" style={{ color: "#9a8590" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="hover:bg-[#fdf8fa] transition-colors" style={{ borderBottom: "1px solid #fdf0f4" }}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                      style={{ background: "#e8789a" }}>
                      {m.name[0]}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#1a0f14" }}>{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: "#8a7a80" }}>{m.email}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 w-fit"
                    style={{
                      background: m.role === "admin" ? "rgba(232,120,154,0.12)" : "rgba(156,163,175,0.1)",
                      color: m.role === "admin" ? "#e8789a" : "#6b7280",
                    }}>
                    {m.role === "admin" && <Shield size={9} />}
                    {m.role === "admin" ? "管理員" : "編輯者"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: "#8a7a80" }}>
                  {new Date(m.createdAt).toLocaleDateString("zh-TW")}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleRole(m)} title={`切換為${m.role === "admin" ? "編輯者" : "管理員"}`}
                      className="p-1.5 rounded-lg transition-colors hover:bg-pink-50" style={{ color: "#8a7a80" }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(m.id, m.name)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50" style={{ color: "#ef4444" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
