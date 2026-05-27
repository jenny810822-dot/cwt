"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Upload, Trash2, CheckCircle, ImageIcon } from "lucide-react"

interface Entry { id: number; title: string; subtitle: string; bgColor: string; dark: boolean; image: string | null }

export default function QuickEntryAdminPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [uploading, setUploading] = useState<number | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const [error, setError] = useState<{ id: number; msg: string } | null>(null)
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch("/api/admin/quickentry").then(r => r.json()).then(setEntries)
  }, [])

  async function handleFile(entry: Entry, file: File) {
    setError(null)
    setUploading(entry.id)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (!res.ok) {
      setError({ id: entry.id, msg: data.error ?? "上傳失敗" })
      setUploading(null)
      return
    }
    const saveRes = await fetch("/api/admin/quickentry", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, image: data.url }),
    })
    setUploading(null)
    if (!saveRes.ok) {
      setError({ id: entry.id, msg: "儲存失敗" })
      return
    }
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, image: data.url } : e))
    setSaved(entry.id)
    setTimeout(() => setSaved(null), 2000)
  }

  async function handleRemove(entry: Entry) {
    if (!confirm(`確定要移除「${entry.title}」的圖片？`)) return
    const res = await fetch("/api/admin/quickentry", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, image: null }),
    })
    if (res.ok) setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, image: null } : e))
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>快速入口圖片</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>為首頁四格快速入口各別設定背景圖片</p>
      </div>

      <div
        className="rounded-xl px-4 py-3 mb-6 text-xs"
        style={{ background: "rgba(232,120,154,0.06)", border: "1px solid rgba(232,120,154,0.15)", color: "#8a7a80" }}
      >
        建議尺寸：<strong style={{ color: "#c45578" }}>600 × 450px</strong> 以上（比例 4:3）· PNG / JPEG / WebP · 5MB 以內
      </div>

      <div className="grid grid-cols-2 gap-5">
        {entries.map(entry => (
          <div
            key={entry.id}
            className="rounded-2xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
          >
            <div className="h-1" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-black" style={{ color: "#1a0f14" }}>{entry.title}</span>
                <span className="text-[9px] tracking-widest" style={{ color: "#9a8590" }}>{entry.subtitle}</span>
              </div>

              {/* Preview */}
              <div
                className="rounded-xl overflow-hidden relative mb-4"
                style={{ aspectRatio: "4/3", background: entry.bgColor }}
              >
                {entry.image ? (
                  <Image src={entry.image} alt={entry.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={28} style={{ color: entry.dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)" }} />
                    <span className="text-[10px]" style={{ color: entry.dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}>
                      尚未設定圖片
                    </span>
                  </div>
                )}
                {saved === entry.id && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="flex items-center gap-2 text-white text-sm font-semibold">
                      <CheckCircle size={18} /> 已套用
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileRefs.current[entry.id]?.click()}
                  disabled={uploading === entry.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                  style={{ background: uploading === entry.id ? "rgba(232,120,154,0.5)" : "#e8789a" }}
                >
                  {uploading === entry.id ? (
                    <><div className="w-3 h-3 rounded-full border border-t-transparent animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} /> 上傳中…</>
                  ) : (
                    <><Upload size={12} /> 上傳圖片</>
                  )}
                </button>
                {entry.image && (
                  <button
                    onClick={() => handleRemove(entry)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                    style={{ background: "#fdf0f0", color: "#ef4444", border: "1px solid #fcd5d5" }}
                  >
                    <Trash2 size={12} /> 移除
                  </button>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  ref={el => { fileRefs.current[entry.id] = el }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(entry, f) }}
                />
              </div>

              {error?.id === entry.id && (
                <div className="mt-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                  {error.msg}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
