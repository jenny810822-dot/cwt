"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import type { NewsItem } from "@/generated/prisma/client"
import RichEditor from "@/components/admin/RichEditor"

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
    body: initialData?.body ?? "",
    coverImage: initialData?.coverImage ?? "",
    link: initialData?.link ?? "",
    published: initialData?.published ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const json = await res.json()
    if (json.url) set("coverImage", json.url)
    setUploading(false)
    e.target.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tag: form.tag || null,
      tagColor: form.tag ? form.tagColor : null,
      coverImage: form.coverImage || null,
      link: form.link || null,
    }
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
        <div className="grid grid-cols-2 gap-4">
          <Field label="日期" hint="例：05.20">
            <Input value={form.date} onChange={v => set("date", v)} placeholder="05.20" required />
          </Field>
          <Field label="排序" hint="數字越小越前面">
            <Input value={String(form.sortOrder)} onChange={v => set("sortOrder", Number(v))} type="number" placeholder="0" />
          </Field>
        </div>

        <Field label="標題">
          <Input value={form.title} onChange={v => set("title", v)} placeholder="輸入消息標題…" required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="標籤（可選）" hint="顯示在標題旁">
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
        </div>

        {/* Cover image */}
        <Field label="封面圖片（可選）" hint="建議 1200×500px">
          {form.coverImage ? (
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/5" }}>
              <Image src={form.coverImage} alt="封面" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => set("coverImage", "")}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                <X size={13} style={{ color: "white" }} />
              </button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-colors"
              style={{ background: "#fdf8fa", border: "2px dashed #f0d8e4", padding: "24px" }}
            >
              <Upload size={18} style={{ color: "#c0a0b0" }} />
              <span className="text-xs" style={{ color: "#9a8590" }}>
                {uploading ? "上傳中…" : "點擊上傳封面圖"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
            </label>
          )}
        </Field>

        {/* Body */}
        <Field label="文章內容" hint="支援標題、粗體、圖片、清單、連結等格式">
          <RichEditor value={form.body} onChange={v => set("body", v)} />
        </Field>

        <Field label="外部連結（可選）" hint="填入後點擊標題跳到外部，留空則顯示文章頁">
          <Input value={form.link} onChange={v => set("link", v)} placeholder="https://..." />
        </Field>

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
