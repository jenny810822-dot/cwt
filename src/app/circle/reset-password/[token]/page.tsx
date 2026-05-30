"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    if (password.length < 6) { setError("密碼至少 6 個字元"); return }
    if (password !== confirm) { setError("兩次密碼不一致"); return }
    setLoading(true)
    const res = await fetch("/api/circle/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
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
          <h2 className="text-xl font-black mb-3" style={{ color: "#1a0f14" }}>密碼已重置</h2>
          <p className="text-sm mb-6" style={{ color: "#6a5a60" }}>您的密碼已更新，請使用新密碼登入。</p>
          <Link href="/circle/login"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white inline-block"
            style={{ background: "#e8789a" }}>
            前往登入
          </Link>
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
            <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>重置密碼</h1>
          </div>

          <form onSubmit={handleSubmit}
            className="rounded-2xl p-8 flex flex-col gap-4"
            style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 4px 24px rgba(232,120,154,0.08)" }}>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>
                新密碼 <span style={{ color: "#9a8590" }}>— 至少 6 個字元</span>
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                onFocus={e => (e.target.style.borderColor = "#e8789a")}
                onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>確認新密碼</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                placeholder="••••••••"
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
              {loading ? "更新中…" : "確認重置"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
