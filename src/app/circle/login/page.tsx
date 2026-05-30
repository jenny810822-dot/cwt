"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import NavRail from "@/components/NavRail"

export default function CircleLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/circle/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? "登入失敗"); setLoading(false); return }
    router.push("/circle/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] flex items-center justify-center">
        <div className="w-full max-w-sm px-8">
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.45em] mb-2 font-medium" style={{ color: "#e8789a" }}>CIRCLE LOGIN</div>
            <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>社團登入</h1>
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

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>密碼</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                onFocus={e => (e.target.style.borderColor = "#e8789a")}
                onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
              />
            </div>

            {error && <p className="text-xs font-medium" style={{ color: "#e8789a" }}>{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors mt-1"
              style={{ background: loading ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
              {loading ? "登入中…" : "登入"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#9a8590" }}>
            尚未申請帳號？
            <Link href="/circle/register" className="font-semibold ml-1" style={{ color: "#e8789a" }}>立即申請</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
