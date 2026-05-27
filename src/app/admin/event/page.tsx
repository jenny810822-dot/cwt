"use client"
import { useState, useEffect } from "react"

export default function EventPage() {
  const [form, setForm] = useState({
    id: 1, nameEn: "", nameSub: "", dateStart: "", dateEnd: "",
    timeStart: "10:30", timeEnd: "16:30", venue: "", accentColor: "#e8789a",
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/admin/event").then(r => r.json()).then(data => { if (data) setForm(data) })
  }, [])

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    if (form.dateStart && form.dateStart < today) {
      setError("開始日期不能早於今天")
      return
    }
    if (form.dateEnd && form.dateStart && form.dateEnd < form.dateStart) {
      setError("結束日期不能早於開始日期")
      return
    }
    setSaving(true)
    const res = await fetch("/api/admin/event", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    })
    setSaving(false)
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? `儲存失敗（${res.status}）`)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>活動資訊</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>設定首頁顯示的活動基本資訊</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
        >
          <div className="h-1" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />
          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="活動英文名稱">
                <Input value={form.nameEn} onChange={v => set("nameEn", v)} placeholder="CWT 68" />
              </Field>
              <Field label="場次副標名稱">
                <Input value={form.nameSub} onChange={v => set("nameSub", v)} placeholder="台北場" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="主題強調色">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.accentColor} onChange={e => set("accentColor", e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer p-0.5"
                    style={{ border: "1.5px solid #f0e4ea", background: "white" }} />
                  <Input value={form.accentColor} onChange={v => set("accentColor", v)} placeholder="#e8789a" />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="開始日期">
                <Input value={form.dateStart} onChange={v => set("dateStart", v)} type="date" min={today} />
              </Field>
              <Field label="結束日期">
                <Input value={form.dateEnd} onChange={v => set("dateEnd", v)} type="date" min={form.dateStart || today} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="開場時間">
                <Input value={form.timeStart} onChange={v => set("timeStart", v)} placeholder="10:30" />
              </Field>
              <Field label="結束時間">
                <Input value={form.timeEnd} onChange={v => set("timeEnd", v)} placeholder="16:30" />
              </Field>
            </div>
            <Field label="活動地點">
              <Input value={form.venue} onChange={v => set("venue", v)} placeholder="台大綜合體育館 1F & B1" />
            </Field>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: saved ? "#4caf50" : saving ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
            {saved ? "✓ 已儲存" : saving ? "儲存中…" : "儲存設定"}
          </button>
          {error && <span className="text-xs" style={{ color: "#ef4444" }}>{error}</span>}
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text", min }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; min?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
      onFocus={e => (e.target.style.borderColor = "#e8789a")}
      onBlur={e => (e.target.style.borderColor = "#f0e4ea")} />
  )
}
