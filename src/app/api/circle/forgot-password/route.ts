import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { resend, FROM } from "@/lib/mail"
import { rateLimit, getIp } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const { ok, retryAfterSec } = rateLimit(`forgot:${getIp(req)}`, 3, 60 * 60 * 1000)
  if (!ok) {
    return NextResponse.json(
      { error: `請求次數過多，請 ${Math.ceil(retryAfterSec / 60)} 分鐘後再試` },
      { status: 429 }
    )
  }

  const { email } = await req.json()
  if (!email?.trim()) return NextResponse.json({ error: "請填寫信箱" }, { status: 400 })

  const circle = await prisma.circle.findUnique({ where: { email } })

  // 不論是否找到都回 ok，避免洩露帳號是否存在
  if (circle && circle.status !== "rejected") {
    const token = crypto.randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 小時後過期

    await prisma.circle.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/circle/reset-password/${token}`

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "【CWT】密碼重置申請",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
          <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
            <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE ACCOUNT</p>
            <h1 style="color:white;font-size:22px;margin:0">密碼重置申請</h1>
          </div>
          <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
            <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
            <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
              我們收到了您的密碼重置申請，請點擊下方按鈕重置密碼。<br>
              此連結將於 <strong>1 小時後</strong>失效，如非本人操作請忽略此信。
            </p>
            <a href="${resetUrl}"
              style="display:inline-block;background:#e8789a;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600">
              重置密碼
            </a>
            <p style="margin:24px 0 0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
          </div>
        </div>`,
    }).catch(() => null)
  }

  return NextResponse.json({ ok: true })
}
