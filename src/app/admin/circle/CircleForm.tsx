"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CircleApplication } from "@/generated/prisma/client"
import RichEditor from "@/components/admin/RichEditor"

const STATUS_OPTIONS = [
  { value: "upcoming", label: "即將開放", color: "#a78bfa" },
  { value: "open",     label: "報名中",   color: "#10b981" },
  { value: "closed",   label: "已截止",   color: "#8a7a80" },
  { value: "full",     label: "名額已滿", color: "#f59e0b" },
]

export default function CircleForm({ initialData }: { initialData?: CircleApplication }) {
  const router = useRouter()
  const isEdit = !!initialData
  const [form, setForm] = useState({
    title:          initialData?.title          ?? "",
    edition:        initialData?.edition        ?? 68,
    location:       initialData?.location       ?? "台北",
    venue:          initialData?.venue          ?? "",
    eventDateStart: initialData?.eventDateStart ?? "",
    eventDateEnd:   initialData?.eventDateEnd   ?? "",
    regOpen:        initialData?.regOpen        ?? "",
    regClose:       initialData?.regClose       ?? "",
    status:         initialData?.status         ?? "upcoming",
    priceHalf:      initialData?.priceHalf      ?? "",
    priceFull:      initialData?.priceFull      ?? "",
    priceLarge:     initialData?.priceLarge     ?? "",
    description:    initialData?.description    ?? "",
    published:      initialData?.published      ?? true,
    sortOrder:      initialData?.sortOrder      ?? 0,
  })
  const [saving, setSaving] = useState(false)

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      edition:   Number(form.edition),
      sortOrder: Number(form.sortOrder),
      priceHalf:   form.priceHalf  !== "" ? Number(form.priceHalf)  : null,
      priceFull:   form.priceFull  !== "" ? Number(form.priceFull)  : null,
      priceLarge:  form.priceLarge !== "" ? Number(form.priceLarge) : null,
    }
    if (isEdit) {
      await fetch(`/api/admin/circle/${initialData!.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      })
    } else {
      await fetch("/api/admin/circle", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      })
    }
    setSaving(false)
    router.push("/admin/circle")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
      >
        {/* Title + edition */}
        <Field label="場次名稱" hint="例：CWT 68 台北場">
          <Input value={form.title} onChange={v => set("title", v)} placeholder="CWT 68 台北場" required />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="屆數">
            <Input value={String(form.edition)} onChange={v => set("edition", v)} type="number" placeholder="68" required />
          </Field>
          <Field label="地區">
            <Input value={form.location} onChange={v => set("location", v)} placeholder="台北" required />
          </Field>
          <Field label="排序" hint="數字越小越前面">
            <Input value={String(form.sortOrder)} onChange={v => set("sortOrder", v)} type="number" placeholder="0" />
          </Field>
        </div>

        <Field label="場館">
          <Input value={form.venue} onChange={v => set("venue", v)} placeholder="台大綜合體育館 1F & B1" />
        </Field>

        {/* Event dates */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="活動開始日期">
            <Input value={form.eventDateStart} onChange={v => set("eventDateStart", v)} placeholder="2025-12-27" required />
          </Field>
          <Field label="活動結束日期">
            <Input value={form.eventDateEnd} onChange={v => set("eventDateEnd", v)} placeholder="2025-12-28" required />
          </Field>
        </div>

        {/* Registration dates */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="報名開始時間" hint="例：2025-09-01 12:00">
            <Input value={form.regOpen} onChange={v => set("regOpen", v)} placeholder="2025-09-01 12:00" />
          </Field>
          <Field label="報名截止時間">
            <Input value={form.regClose} onChange={v => set("regClose", v)} placeholder="2025-09-20 23:59" />
          </Field>
        </div>

        {/* Status */}
        <Field label="報名狀態">
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(s => (
              <button key={s.value} type="button" onClick={() => set("status", s.value)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: form.status === s.value ? s.color : `${s.color}18`,
                  color: form.status === s.value ? "white" : s.color,
                  border: `1.5px solid ${s.color}`,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Prices */}
        <Field label="報名費用（NT$，留空表示無此桌型）">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-[#9a8590] block mb-1">半桌（約 45cm）</label>
              <Input value={String(form.priceHalf)} onChange={v => set("priceHalf", v)} type="number" placeholder="800" />
            </div>
            <div>
              <label className="text-[10px] text-[#9a8590] block mb-1">全桌（約 90cm）</label>
              <Input value={String(form.priceFull)} onChange={v => set("priceFull", v)} type="number" placeholder="1500" />
            </div>
            <div>
              <label className="text-[10px] text-[#9a8590] block mb-1">大桌（約 180cm）</label>
              <Input value={String(form.priceLarge)} onChange={v => set("priceLarge", v)} type="number" placeholder="2800" />
            </div>
          </div>
        </Field>

        {/* Description */}
        <Field label="詳細說明" hint="報名資格、注意事項、流程等">
          <RichEditor value={form.description} onChange={v => set("description", v)} />
        </Field>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => set("published", !form.published)}
            className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
            style={{ background: form.published ? "#e8789a" : "#d0c0c8" }}>
            <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
              style={{ left: form.published ? "calc(100% - 18px)" : "2px" }} />
          </button>
          <span className="text-sm font-medium" style={{ color: "#5a4550" }}>
            {form.published ? "已發布 — 前台可見" : "草稿 — 僅後台可見"}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: saving ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
          {saving ? "儲存中…" : isEdit ? "儲存變更" : "新增場次"}
        </button>
        <button type="button" onClick={() => router.push("/admin/circle")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#f0e8ec", color: "#5a4550" }}>
          取消
        </button>
      </div>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>
        {label}
        {hint && <span className="ml-1 font-normal" style={{ color: "#9a8590" }}>— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, required, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
      onFocus={e => (e.target.style.borderColor = "#e8789a")}
      onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
    />
  )
}
