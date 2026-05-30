import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { resend, FROM } from "@/lib/mail"

const TABLE_LABELS: Record<string, string> = { half: "半桌", full: "全桌", large: "大桌" }

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const reg = await prisma.circleEventApplication.findUnique({ where: { id: Number(id) } })
  if (!reg) return NextResponse.json({ error: "找不到報名記錄" }, { status: 404 })

  const [circle, event] = await Promise.all([
    prisma.circle.findUnique({ where: { id: reg.circleId }, select: { name: true, leaderName: true, email: true } }),
    prisma.circleApplication.findUnique({ where: { id: reg.eventApplicationId }, select: { title: true, eventDateStart: true, eventDateEnd: true, venue: true } }),
  ])
  if (!circle || !event) return NextResponse.json({ error: "找不到相關資料" }, { status: 404 })

  const tableLabel = TABLE_LABELS[reg.tableType] ?? reg.tableType

  let subject = ""
  let bodyContent = ""

  if (reg.status === "pending") {
    subject = `【CWT】場次報名已送出 — ${event.title}`
    bodyContent = `
      <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
        <strong>${circle.name}</strong> 的場次報名已送出，主辦單位審核後將以此信箱通知結果，請耐心等候。
      </p>
      <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
        <table style="font-size:13px;width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#8a7a80;width:90px">活動場次</td><td>${event.title}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">桌位類型</td><td>${tableLabel}</td></tr>
          ${reg.adjacentRequest ? `<tr><td style="padding:4px 0;color:#8a7a80">連攤申請</td><td>${reg.adjacentRequest}</td></tr>` : ""}
        </table>
      </div>`
  } else if (reg.status === "approved") {
    subject = `【CWT】場次報名審核通過 — ${event.title}`
    bodyContent = `
      <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
        恭喜！<strong>${circle.name}</strong> 的場次報名已錄取，請依主辦通知完成後續繳費流程。
      </p>
      <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
        <table style="font-size:13px;width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#8a7a80;width:90px">活動場次</td><td>${event.title}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">活動日期</td><td>${event.eventDateStart} — ${event.eventDateEnd}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">地點</td><td>${event.venue}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">桌位類型</td><td>${tableLabel}</td></tr>
        </table>
      </div>`
  } else if (reg.status === "rejected") {
    subject = `【CWT】場次報名審核結果通知 — ${event.title}`
    bodyContent = `
      <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
        感謝您報名 <strong>${event.title}</strong>，本次報名未能錄取，如有疑問請回覆此信件洽詢。
      </p>
      <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
        <table style="font-size:13px;width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#8a7a80;width:90px">活動場次</td><td>${event.title}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">桌位類型</td><td>${tableLabel}</td></tr>
        </table>
      </div>`
  } else if (reg.status === "paid") {
    subject = `【CWT】繳費確認通知 — ${event.title}`
    bodyContent = `
      <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
        <strong>${circle.name}</strong> 的繳費已確認，感謝您完成報名手續，期待在活動中與您相見！
      </p>
      <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
        <table style="font-size:13px;width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#8a7a80;width:90px">活動場次</td><td>${event.title}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">活動日期</td><td>${event.eventDateStart} — ${event.eventDateEnd}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">地點</td><td>${event.venue}</td></tr>
          <tr><td style="padding:4px 0;color:#8a7a80">桌位類型</td><td>${tableLabel}</td></tr>
        </table>
      </div>`
  } else {
    return NextResponse.json({ error: "無法對應的狀態" }, { status: 400 })
  }

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
      <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
        <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
        <h1 style="color:white;font-size:22px;margin:0">${subject.replace("【CWT】", "").split(" — ")[0]}</h1>
      </div>
      <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
        <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
        ${bodyContent}
        <p style="margin:0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
      </div>
    </div>`

  const { error } = await resend.emails.send({ from: FROM, to: circle.email, subject, html })
  if (error) return NextResponse.json({ error: "寄送失敗" }, { status: 500 })

  return NextResponse.json({ ok: true })
}
