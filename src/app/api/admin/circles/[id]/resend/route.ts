import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { resend, FROM } from "@/lib/mail"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const circle = await prisma.circle.findUnique({
    where: { id: Number(id) },
    select: { name: true, leaderName: true, email: true, status: true },
  })
  if (!circle) return NextResponse.json({ error: "找不到社團" }, { status: 404 })

  let subject = ""
  let html = ""

  if (circle.status === "pending") {
    subject = `【CWT】社團帳號申請確認 — ${circle.name}`
    html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
        <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
          <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
          <h1 style="color:white;font-size:22px;margin:0">申請已收到！</h1>
        </div>
        <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
          <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
          <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
            感謝 <strong>${circle.name}</strong> 提交社團帳號申請。<br>
            主辦單位將於 7–10 個工作天內完成審核，結果將以此信箱通知，請耐心等候。
          </p>
          <p style="margin:0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
        </div>
      </div>`
  } else if (circle.status === "approved") {
    subject = `【CWT】社團帳號審核通過 — ${circle.name}`
    html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
        <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
          <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
          <h1 style="color:white;font-size:22px;margin:0">審核通過！</h1>
        </div>
        <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
          <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
          <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
            恭喜！<strong>${circle.name}</strong> 的社團帳號申請已審核通過。<br>
            請登入社團帳號，即可報名開放中的活動場次。
          </p>
          <a href="https://cwt.tw/circle/login"
            style="display:inline-block;background:#e8789a;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600">
            立即登入報名
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
        </div>
      </div>`
  } else if (circle.status === "rejected") {
    subject = `【CWT】社團帳號審核結果通知 — ${circle.name}`
    html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
        <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
          <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
          <h1 style="color:white;font-size:22px;margin:0">審核結果通知</h1>
        </div>
        <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
          <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
          <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
            感謝您提交 <strong>${circle.name}</strong> 的社團帳號申請。<br>
            經主辦審核，本次申請未通過，如有疑問請回覆此信件洽詢。
          </p>
          <p style="margin:0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
        </div>
      </div>`
  } else {
    return NextResponse.json({ error: "無法對應的狀態" }, { status: 400 })
  }

  const { error } = await resend.emails.send({ from: FROM, to: circle.email, subject, html })
  if (error) return NextResponse.json({ error: "寄送失敗" }, { status: 500 })

  return NextResponse.json({ ok: true })
}
