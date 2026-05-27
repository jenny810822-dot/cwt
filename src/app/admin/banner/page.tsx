"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Upload, ImageIcon, Trash2, CheckCircle } from "lucide-react"

export default function BannerPage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [eventId, setEventId] = useState<number>(1)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/admin/event")
      .then(r => r.json())
      .then(data => {
        if (data) {
          setEventId(data.id)
          setCurrentImage(data.heroImage ?? null)
        }
      })
  }, [])

  async function handleFile(file: File) {
    setError("")
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) {
      setError(data.error ?? "上傳失敗")
      return
    }
    setPreview(URL.createObjectURL(file))
    setPendingUrl(data.url)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleSave() {
    if (!pendingUrl) return
    setSaving(true)
    setError("")
    const res = await fetch("/api/admin/event", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: eventId, heroImage: pendingUrl }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? `儲存失敗（${res.status}）`)
      return
    }
    setCurrentImage(pendingUrl)
    setPendingUrl(null)
    setPreview(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleRemove() {
    if (!confirm("確定要移除目前的主視覺圖片？")) return
    await fetch("/api/admin/event", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: eventId, heroImage: null }),
    })
    setCurrentImage(null)
    setPendingUrl(null)
    setPreview(null)
  }

  const displayImage = preview ?? currentImage

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>主視覺管理</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>上傳首頁 Hero 區域的看板娘或背景圖片</p>
      </div>

      {/* Current / Preview */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
      >
        <div className="h-1" style={{ background: "linear-gradient(to right, #e8789a, #c45578)" }} />

        <div className="p-6">
          <div className="text-xs font-semibold mb-3" style={{ color: "#5a4550" }}>
            {displayImage ? "目前圖片預覽" : "尚未設定圖片"}
          </div>

          {displayImage ? (
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: "#140810" }}>
              <Image
                src={displayImage}
                alt="Hero banner"
                fill
                className="object-cover object-top"
                unoptimized
              />
              {preview && (
                <div
                  className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(232,120,154,0.9)", color: "white" }}
                >
                  待儲存
                </div>
              )}
            </div>
          ) : (
            <div
              className="rounded-xl flex flex-col items-center justify-center"
              style={{ aspectRatio: "16/9", background: "#fdf0f4", border: "2px dashed #f0c8d8" }}
            >
              <ImageIcon size={40} style={{ color: "#e8789a", opacity: 0.4 }} />
              <div className="text-sm mt-2" style={{ color: "#c0a0b0" }}>尚無圖片</div>
            </div>
          )}
        </div>
      </div>

      {/* Upload area */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ background: "white", boxShadow: "0 2px 16px rgba(232,120,154,0.07)", border: "1px solid #f0e4ea" }}
      >
        <div className="p-6">
          <div className="text-xs font-semibold mb-3" style={{ color: "#5a4550" }}>上傳新圖片</div>

          {/* Drop zone */}
          <div
            className="rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors"
            style={{ padding: "40px 20px", border: "2px dashed #f0c8d8", background: "#fdf8fa" }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#e8789a")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#f0c8d8")}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-3"
                  style={{ borderColor: "#e8789a", borderTopColor: "transparent" }} />
                <div className="text-sm" style={{ color: "#8a7a80" }}>上傳中…</div>
              </>
            ) : (
              <>
                <Upload size={28} style={{ color: "#e8789a", opacity: 0.7 }} />
                <div className="text-sm font-medium mt-2" style={{ color: "#5a4550" }}>
                  點擊或拖曳圖片到這裡
                </div>
                <div className="text-xs mt-1" style={{ color: "#9a8590" }}>
                  支援 JPG、PNG、WebP，最大 10MB
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#b0a0a8" }}>
                  建議尺寸：1400 × 900px 以上，角色圖可用透明背景 PNG
                </div>
              </>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />

          {error && (
            <div className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {pendingUrl && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: saved ? "#4caf50" : saving ? "rgba(232,120,154,0.5)" : "#e8789a" }}
          >
            <CheckCircle size={15} />
            {saved ? "已套用" : saving ? "套用中…" : "套用到官網"}
          </button>
        )}

        {currentImage && !pendingUrl && (
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "#fdf0f0", color: "#ef4444", border: "1px solid #fcd5d5" }}
          >
            <Trash2 size={14} />
            移除圖片
          </button>
        )}

        {pendingUrl && (
          <button
            onClick={() => { setPendingUrl(null); setPreview(null) }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "#f0e8ec", color: "#5a4550" }}
          >
            取消
          </button>
        )}
      </div>

      {/* Tips */}
      <div
        className="mt-6 rounded-xl p-4"
        style={{ background: "rgba(232,120,154,0.05)", border: "1px solid rgba(232,120,154,0.15)" }}
      >
        <div className="text-xs font-semibold mb-2" style={{ color: "#c45578" }}>圖片使用提示</div>
        <ul className="text-xs space-y-1" style={{ color: "#8a7a80" }}>
          <li>• 角色圖建議使用 <strong>透明背景 PNG</strong>，與背景融合更自然</li>
          <li>• 圖片會顯示在首頁 Hero 區域中央，建議角色面向左側</li>
          <li>• 若使用照片背景，系統會自動套用漸層遮罩保持文字可讀</li>
          <li>• 更換後需等幾秒讓瀏覽器快取更新</li>
        </ul>
      </div>
    </div>
  )
}
