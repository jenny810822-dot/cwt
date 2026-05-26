"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", {
      email, password, redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError("帳號或密碼錯誤")
    } else {
      router.push("/admin")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#140810" }}
    >
      {/* Glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          background: "rgba(232,120,154,0.12)",
          filter: "blur(100px)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative w-full max-w-sm mx-4">
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-3xl font-black text-white tracking-tight">CWT</div>
            <div className="text-[11px] tracking-[0.3em] mt-1" style={{ color: "#e8789a" }}>
              ADMIN SYSTEM
            </div>
            <div className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              請登入以管理網站內容
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                電子郵件
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@cwt.tw"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
                onFocus={e => (e.target.style.borderColor = "#e8789a")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div>
              <label className="text-[11px] font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
                onFocus={e => (e.target.style.borderColor = "#e8789a")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {error && (
              <div className="text-xs text-center py-2 px-3 rounded-lg"
                style={{ color: "#f87171", background: "rgba(248,113,113,0.1)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? "rgba(232,120,154,0.5)" : "#e8789a" }}
            >
              {loading ? "登入中…" : "登入 →"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          CWT 台灣同人誌販售會 Admin System
        </div>
      </div>
    </div>
  )
}
