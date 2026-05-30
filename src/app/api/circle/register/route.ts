import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { resend, FROM } from "@/lib/mail"

function isValidUrl(s: string) {
  try { new URL(s); return true } catch { return false }
}

export async function POST(req: Request) {
  const { name, leaderName, email, password, phone, type, region, genres, portfolioUrl, snsUrl, note } = await req.json()

  if (!name?.trim()) return NextResponse.json({ error: "請填寫社團名稱" }, { status: 400 })
  if (!leaderName?.trim()) return NextResponse.json({ error: "請填寫負責人姓名" }, { status: 400 })
  if (!email?.trim()) return NextResponse.json({ error: "請填寫聯絡信箱" }, { status: 400 })
  if (!password) return NextResponse.json({ error: "請設定密碼" }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: "密碼至少 6 個字元" }, { status: 400 })
  if (!phone?.trim()) return NextResponse.json({ error: "請填寫聯絡電話" }, { status: 400 })
  if (!["doujin", "agency"].includes(type)) return NextResponse.json({ error: "社團性質無效" }, { status: 400 })
  if (!["taiwan", "overseas"].includes(region)) return NextResponse.json({ error: "地區選項無效" }, { status: 400 })
  if (!genres?.trim()) return NextResponse.json({ error: "請選擇至少一種創作類型" }, { status: 400 })
  if (!portfolioUrl?.trim()) return NextResponse.json({ error: "請填寫作品展示連結" }, { status: 400 })
  if (!isValidUrl(portfolioUrl)) return NextResponse.json({ error: "作品展示連結格式不正確，請以 https:// 開頭" }, { status: 400 })
  if (snsUrl?.trim() && !isValidUrl(snsUrl)) return NextResponse.json({ error: "SNS 連結格式不正確，請以 https:// 開頭" }, { status: 400 })

  try {
    const existing = await prisma.circle.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "此信箱已註冊" }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
    await prisma.circle.create({
      data: { name: name.trim(), leaderName: leaderName.trim(), email, password: hashed, phone: phone.trim(), type, region, genres, portfolioUrl, snsUrl: snsUrl ?? "", note: note ?? "", status: "pending" },
    })
  } catch (err) {
    console.error("[circle/register]", err)
    return NextResponse.json({ error: "伺服器錯誤，請稍後再試" }, { status: 500 })
  }

  const regionLabel = region === "overseas" ? "海外" : "台灣國內"

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `【CWT】社團帳號申請確認 — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
        <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
          <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
          <h1 style="color:white;font-size:22px;margin:0">申請已收到！</h1>
        </div>
        <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
          <p style="margin:0 0 16px">您好，<strong>${leaderName}</strong>，</p>
          <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
            感謝 <strong>${name}</strong> 提交社團帳號申請。<br>
            主辦單位將於 7–10 個工作天內完成審核，結果將以此信箱通知，請耐心等候。
          </p>
          <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:11px;color:#9a8590;letter-spacing:0.1em">申請資料摘要</p>
            <table style="font-size:13px;width:100%;border-collapse:collapse">
              <tr><td style="padding:4px 0;color:#8a7a80;width:90px">社團名稱</td><td>${name}</td></tr>
              <tr><td style="padding:4px 0;color:#8a7a80">負責人</td><td>${leaderName}</td></tr>
              <tr><td style="padding:4px 0;color:#8a7a80">聯絡信箱</td><td>${email}</td></tr>
              <tr><td style="padding:4px 0;color:#8a7a80">聯絡電話</td><td>${phone}</td></tr>
              <tr><td style="padding:4px 0;color:#8a7a80">申請地區</td><td>${regionLabel}</td></tr>
            </table>
          </div>
          <p style="margin:0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
        </div>
      </div>
    `,
  }).catch(() => null)

  return NextResponse.json({ ok: true })
}
