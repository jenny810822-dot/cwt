"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { NewsItem } from "@/generated/prisma/client"

const TAG_COLORS = [
  { label: "粉紅", value: "#e8789a" },
  { label: "深粉", value: "#c45578" },
  { label: "深色", value: "#1a0f14" },
  { label: "藍", value: "#5b9bd4" },
  { label: "綠", value: "#4caf50" },
]

export default function NewsForm({ initialData }: { initialData?: NewsItem }) {
  const router = useRouter()
  const isEdit = !!initialData
  const [form, setForm] = useState({
    date: initialData?.date ?? "",
    title: initialData?.title ?? "",
    tag: initialData?.tag ?? "",
    tagColor: initialData?.tagColor ?? "#e8789a",
    link: initialData?.link ?? "",
    published: initialData?.published ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  })
  const [saving, setSaving] = useState(false)

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, tag: form.tag || null, tagColor: form.tag ? form.tagColor : null }
    if (isEdit) {
      await fetch(`/api/admin/news/${initialData!.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      })
    } else {
      await fetch("/api/admin/news", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      })
    }
    setSaving(false)
    router.push("/admin/news")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
      >
        <Field label="日期" hint="例：05.20">
          <Input value={form.date} onChange={v => set("date", v)} placeholder="05.20" required />
        </Field>
        <Field label="標題">
          <Input value={form.title} onChange={v => set("title", v)} placeholder="輸入消息標題…" required />
        </Field>
        <Field label="標籤（可選）" hint="顯示在標題旁的小標籤">
          <Input value={form.tag} onChange={v => set("tag", v)} placeholder="例：重要、NEW" />
        </Field>
        {form.tag && (
          <Field label="標籤顏色">
            <div className="flex gap-2 flex-wrap">
              {TAG_COLORS.map(c => (
                <button key={c.value} type="button" onClick={() => set("tagColor", c.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: form.tagColor === c.value ? c.value : `${c.value}18`,
                    color: form.tagColor === c.value ? "white" : c.value,
                    border: `1.5px solid ${c.value}`,
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
          </Field>
        )}
        <Field label="連結（可選）">
          <Input value={form.link} onChange={v => set("link", v)} placeholder="/event/..." />
        </Field>
        <Field label="排序（數字越小越前面）">
          <Input value={String(form.sortOrder)} onChange={v => set("sortOrder", Number(v))} type="number" placeholder="0" />
        </Field>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => set("published", !form.published)}
            className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
            style={{ background: form.published ? "#e8789a" : "#d0c0c8" }}>
            <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
              style={{ left: form.published ? "calc(100% - 18px)" : "2px" }} />
          </button>
          <span className="text-sm font-medium" style={{ color: "#5a4550" }}>
            {form.published ? "已發布 — 首頁可見" : "草稿 — 首頁不顯示"}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: saving ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
          {saving ? "儲存中…" : isEdit ? "儲存變更" : "新增消息"}
        </button>
        <button type="button" onClick={() => router.push("/admin/news")}
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
