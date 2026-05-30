"use client"
import { useState } from "react"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/circle/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? "發生錯誤"); setLoading(false); return }
    setDone(true)
  }

  if (done) return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] flex items-center justify-center">
        <div className="text-center max-w-sm px-8">
          <CheckCircle size={48} style={{ color: "#10b981" }} className="mx-auto mb-4" />
          <h2 className="text-xl font-black mb-3" style={{ color: "#1a0f14" }}>信件已送出</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#6a5a60" }}>
            如果此信箱有對應的帳號，您將會收到密碼重置信件，請檢查您的信箱（含垃圾郵件匣）。
          </p>
          <Link href="/circle/login" className="text-sm font-medium" style={{ color: "#e8789a" }}>← 返回登入</Link>
        </div>
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] flex items-center justify-center">
        <div className="w-full max-w-sm px-8">
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.45em] mb-2 font-medium" style={{ color: "#e8789a" }}>CIRCLE ACCOUNT</div>
            <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>忘記密碼</h1>
            <p className="text-xs mt-2" style={{ color: "#9a8590" }}>輸入您的帳號信箱，我們將寄送重置連結</p>
          </div>

          <form onSubmit={handleSubmit}
            className="rounded-2xl p-8 flex flex-col gap-4"
            style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 4px 24px rgba(232,120,154,0.08)" }}>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>信箱</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                onFocus={e => (e.target.style.borderColor = "#e8789a")}
                onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
              />
            </div>
            {error && <p className="text-xs font-medium" style={{ color: "#e8789a" }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-1"
              style={{ background: loading ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
              {loading ? "送出中…" : "送出重置申請"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#9a8590" }}>
            想起密碼了？
            <Link href="/circle/login" className="font-semibold ml-1" style={{ color: "#e8789a" }}>返回登入</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
