"use client"
import { useRef, useState } from "react"
import Link from "next/link"
import NavRail from "@/components/NavRail"
import { CheckCircle } from "lucide-react"

const GENRES = ["漫畫", "小說", "插畫", "周邊商品", "Cosplay 道具", "其他"]

export default function CircleRegisterPage() {
  const [form, setForm] = useState({
    name: "", leaderName: "", email: "", password: "", confirm: "",
    phone: "", type: "doujin", region: "taiwan", genres: [] as string[],
    portfolioUrl: "", snsUrl: "", note: "",
  })
  const submittingRef = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  function set(k: string, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  function toggleGenre(g: string) {
    setForm(p => ({
      ...p,
      genres: p.genres.includes(g) ? p.genres.filter(x => x !== g) : [...p.genres, g],
    }))
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submittingRef.current) return
    setError("")

    if (!form.name.trim()) { setError("請填寫社團名稱"); return }
    if (!form.leaderName.trim()) { setError("請填寫負責人姓名"); return }
    if (!form.email.trim()) { setError("請填寫聯絡信箱"); return }
    if (!form.phone.trim()) { setError("請填寫聯絡電話"); return }
    if (form.password.length < 6) { setError("密碼至少 6 個字元"); return }
    if (form.password !== form.confirm) { setError("兩次密碼不一致"); return }
    if (form.genres.length === 0) { setError("請選擇至少一種創作類型"); return }
    if (!form.portfolioUrl.trim()) { setError("請填寫作品展示連結"); return }
    try { new URL(form.portfolioUrl) } catch { setError("作品展示連結格式不正確，請以 https:// 開頭"); return }
    if (form.snsUrl.trim()) {
      try { new URL(form.snsUrl) } catch { setError("SNS 連結格式不正確，請以 https:// 開頭"); return }
    }

    submittingRef.current = true
    setSubmitting(true)

    try {
      // exclude confirm from payload
      const { confirm: _, ...payload } = form
      const res = await fetch("/api/circle/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, genres: form.genres.join(",") }),
      })
      let data: { error?: string } = {}
      try { data = await res.json() } catch { /* empty body */ }
      if (!res.ok) {
        setError(data.error ?? "發生錯誤")
        return
      }
      setDone(true)
    } catch {
      setError("網路錯誤，請確認連線後再試")
    } finally {
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  if (done) return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px] flex items-center justify-center">
        <div className="text-center max-w-md px-8">
          <CheckCircle size={48} style={{ color: "#10b981" }} className="mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3" style={{ color: "#1a0f14" }}>申請已送出！</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#6a5a60" }}>
            感謝您的申請。主辦單位將於 7–10 個工作天內完成審核，結果將以 Email 通知，請留意信箱。
          </p>
          <Link href="/circle" className="text-sm font-medium" style={{ color: "#e8789a" }}>← 返回社團報名</Link>
        </div>
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px]">
        <div className="relative px-10 pt-12 pb-10" style={{ background: "#140810" }}>
          <div className="text-[10px] tracking-[0.45em] mb-2 font-medium" style={{ color: "#e8789a" }}>CIRCLE APPLICATION</div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "white" }}>社團帳號申請</h1>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>填寫完整資料送出後，等待主辦審核通過即可報名場次</p>
        </div>

        <div className="px-10 py-10 max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* 社團基本資料 */}
            <Section title="社團基本資料">
              <Field label="社團名稱" required>
                <Input value={form.name} onChange={v => set("name", v)} placeholder="請輸入社團名稱" />
              </Field>
              <Field label="負責人姓名" required>
                <Input value={form.leaderName} onChange={v => set("leaderName", v)} placeholder="請輸入負責人真實姓名" />
              </Field>
              <Field label="社團性質" required>
                <div className="flex gap-3">
                  {[{ v: "doujin", l: "一般同人社" }, { v: "agency", l: "代理攤" }].map(({ v, l }) => (
                    <ToggleButton key={v} selected={form.type === v} onClick={() => set("type", v)}>{l}</ToggleButton>
                  ))}
                </div>
              </Field>
              <Field label="申請地區" required>
                <div className="flex gap-3">
                  {[{ v: "taiwan", l: "台灣國內" }, { v: "overseas", l: "海外" }].map(({ v, l }) => (
                    <ToggleButton key={v} selected={form.region === v} onClick={() => set("region", v)}>{l}</ToggleButton>
                  ))}
                </div>
              </Field>
              <Field label="主要創作類型" required hint="可複選">
                <div className="flex gap-2 flex-wrap">
                  {GENRES.map(g => (
                    <ToggleButton key={g} selected={form.genres.includes(g)} onClick={() => toggleGenre(g)} accent>{g}</ToggleButton>
                  ))}
                </div>
              </Field>
            </Section>

            {/* 聯絡資料 */}
            <Section title="聯絡資料">
              <Field label="聯絡信箱" required hint="作為登入帳號使用">
                <Input value={form.email} onChange={v => set("email", v)} type="email" placeholder="your@email.com" />
              </Field>
              <Field label="聯絡電話" required>
                <Input value={form.phone} onChange={v => set("phone", v)} placeholder="09xx-xxx-xxx" />
              </Field>
            </Section>

            {/* 密碼 */}
            <Section title="設定密碼">
              <Field label="密碼" required hint="至少 6 個字元">
                <Input value={form.password} onChange={v => set("password", v)} type="password" placeholder="••••••••" />
              </Field>
              <Field label="確認密碼" required>
                <Input value={form.confirm} onChange={v => set("confirm", v)} type="password" placeholder="••••••••" />
              </Field>
            </Section>

            {/* 作品資料 */}
            <Section title="作品資料">
              <Field label="作品展示連結" required hint="個人網站、Pixiv、Twitter 等均可">
                <Input value={form.portfolioUrl} onChange={v => set("portfolioUrl", v)} placeholder="https://..." />
              </Field>
              <Field label="SNS 連結" hint="選填，Twitter/X、Instagram 等">
                <Input value={form.snsUrl} onChange={v => set("snsUrl", v)} placeholder="https://..." />
              </Field>
              <Field label="備註" hint="選填，特殊情況說明等">
                <textarea
                  value={form.note} onChange={e => set("note", e.target.value)}
                  placeholder="其他補充說明…"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
                  onFocus={e => (e.target.style.borderColor = "#e8789a")}
                  onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
                />
              </Field>
            </Section>

            {error && <p className="text-sm font-medium" style={{ color: "#e8789a" }}>{error}</p>}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={submitting}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: submitting ? "rgba(232,120,154,0.5)" : "#e8789a" }}>
                {submitting ? "送出中…" : "送出申請"}
              </button>
              <Link href="/circle/login" className="text-sm" style={{ color: "#9a8590" }}>
                已有帳號？登入
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: "white", border: "1px solid #f0e4ea", boxShadow: "0 2px 12px rgba(232,120,154,0.05)" }}>
      <h3 className="text-sm font-bold" style={{ color: "#1a0f14" }}>{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#5a4550" }}>
        {label}{required && <span style={{ color: "#e8789a" }}> *</span>}
        {hint && <span className="ml-1 font-normal" style={{ color: "#9a8590" }}>— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

function ToggleButton({ selected, onClick, children, accent }: { selected: boolean; onClick: () => void; children: React.ReactNode; accent?: boolean }) {
  const activeColor = accent ? "#e8789a" : "#1a0f14"
  return (
    <button type="button" onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: selected ? activeColor : "#f0e8ec",
        color: selected ? "white" : "#5a4550",
        border: `1.5px solid ${selected ? activeColor : "#f0e4ea"}`,
      }}>
      {children}
    </button>
  )
}

function Input({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{ background: "#fdf8fa", border: "1.5px solid #f0e4ea", color: "#1a0f14" }}
      onFocus={e => (e.target.style.borderColor = "#e8789a")}
      onBlur={e => (e.target.style.borderColor = "#f0e4ea")}
    />
  )
}
