import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { resend, FROM } from "@/lib/mail"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get("eventId")

  const regs = await prisma.circleEventApplication.findMany({
    where: eventId ? { eventApplicationId: Number(eventId) } : undefined,
    orderBy: { createdAt: "asc" },
  })

  const circleIds = [...new Set(regs.map(r => r.circleId))]
  const circles = await prisma.circle.findMany({
    where: { id: { in: circleIds } },
    select: { id: true, name: true, leaderName: true, email: true, phone: true, genres: true, portfolioUrl: true },
  })
  const circleMap = Object.fromEntries(circles.map(c => [c.id, c]))

  return NextResponse.json(regs.map(r => ({ ...r, circle: circleMap[r.circleId] ?? null })))
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, status } = await req.json()

  // read old status before updating
  const before = await prisma.circleEventApplication.findUnique({ where: { id: Number(id) }, select: { status: true } })
  const oldStatus = before?.status ?? ""

  const reg = await prisma.circleEventApplication.update({
    where: { id: Number(id) },
    data: { status },
  })

  const shouldMail = ["approved", "rejected", "paid"].includes(status) || status === "pending"
  if (shouldMail) {
    const [circle, event] = await Promise.all([
      prisma.circle.findUnique({ where: { id: reg.circleId }, select: { name: true, leaderName: true, email: true } }),
      prisma.circleApplication.findUnique({ where: { id: reg.eventApplicationId }, select: { title: true, eventDateStart: true, eventDateEnd: true, venue: true } }),
    ])

    if (circle && event) {
      const TABLE_LABELS: Record<string, string> = { half: "半桌", full: "全桌", large: "大桌" }
      const tableLabel = TABLE_LABELS[reg.tableType] ?? reg.tableType
      const isRevert = status === "pending" || (status === "approved" && oldStatus === "paid")

      let subject = ""
      let headline = ""
      let body = ""

      if (isRevert) {
        // revert cases
        if (status === "pending") {
          subject = `【CWT】場次報名狀態更正通知 — ${event.title}`
          headline = "報名狀態更正"
          body = `
            <p style="margin:0 0 16px;padding:14px 18px;border-radius:10px;background:#fef9c3;font-size:13px;color:#854d0e;line-height:1.6">
              ⚠️ 此封信件為狀態更正通知，並非新的審核結果。
            </p>
            <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
              您好，主辦單位發現 <strong>${circle.name}</strong> 的場次報名狀態因操作失誤需要調整，
              目前已更正回「<strong>審核中</strong>」，請靜待主辦再次審核，造成困擾深感抱歉。
            </p>`
        } else {
          // paid → approved
          subject = `【CWT】繳費狀態更正通知 — ${event.title}`
          headline = "繳費狀態更正"
          body = `
            <p style="margin:0 0 16px;padding:14px 18px;border-radius:10px;background:#fef9c3;font-size:13px;color:#854d0e;line-height:1.6">
              ⚠️ 此封信件為狀態更正通知，請以本信內容為準。
            </p>
            <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
              您好，主辦單位發現 <strong>${circle.name}</strong> 的繳費確認有誤，
              目前已更正為「<strong>錄取（待繳費）</strong>」，如有疑問請直接回覆此信件洽詢，造成困擾深感抱歉。
            </p>`
        }
      } else if (status === "approved") {
        subject = `【CWT】場次報名審核通過 — ${event.title}`
        headline = "恭喜！報名錄取"
        body = `<p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
          恭喜！<strong>${circle.name}</strong> 的場次報名已錄取，請依主辦通知完成後續繳費流程。</p>`
      } else if (status === "rejected") {
        subject = `【CWT】場次報名審核結果通知 — ${event.title}`
        headline = "報名審核結果通知"
        body = `<p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
          感謝您報名 <strong>${event.title}</strong>，本次報名未能錄取，如有疑問請回覆此信件洽詢。</p>`
      } else if (status === "paid") {
        subject = `【CWT】繳費確認通知 — ${event.title}`
        headline = "繳費已確認"
        body = `<p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
          <strong>${circle.name}</strong> 的繳費已確認，感謝您完成報名手續，期待在活動中與您相見！</p>`
      }

      await resend.emails.send({
        from: FROM,
        to: circle.email,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
            <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
              <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
              <h1 style="color:white;font-size:22px;margin:0">${headline}</h1>
            </div>
            <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
              <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
              ${body}
              <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
                <p style="margin:0 0 8px;font-size:11px;color:#9a8590;letter-spacing:0.1em">報名資料</p>
                <table style="font-size:13px;width:100%;border-collapse:collapse">
                  <tr><td style="padding:4px 0;color:#8a7a80;width:90px">活動場次</td><td>${event.title}</td></tr>
                  <tr><td style="padding:4px 0;color:#8a7a80">活動日期</td><td>${event.eventDateStart} — ${event.eventDateEnd}</td></tr>
                  <tr><td style="padding:4px 0;color:#8a7a80">地點</td><td>${event.venue}</td></tr>
                  <tr><td style="padding:4px 0;color:#8a7a80">桌位類型</td><td>${tableLabel}</td></tr>
                </table>
              </div>
              <p style="margin:0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
            </div>
          </div>`,
      }).catch(() => null)
    }
  }

  return NextResponse.json(reg)
}
