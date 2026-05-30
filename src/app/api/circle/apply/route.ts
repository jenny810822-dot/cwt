import { NextResponse } from "next/server"
import { getCircleSession } from "@/lib/circle-auth"
import { prisma } from "@/lib/prisma"
import { resend, FROM } from "@/lib/mail"

export async function POST(req: Request) {
  const session = await getCircleSession()
  if (!session) return NextResponse.json({ error: "請先登入" }, { status: 401 })

  const circle = await prisma.circle.findUnique({ where: { id: session.id } })
  if (!circle) return NextResponse.json({ error: "帳號不存在" }, { status: 404 })
  if (circle.status !== "approved") return NextResponse.json({ error: "帳號尚未審核通過" }, { status: 403 })

  const { eventApplicationId, tableType, adjacentRequest, note } = await req.json()
  if (!eventApplicationId || !tableType) return NextResponse.json({ error: "請填寫必要欄位" }, { status: 400 })

  // Check event is open
  const event = await prisma.circleApplication.findUnique({ where: { id: Number(eventApplicationId) } })
  if (!event) return NextResponse.json({ error: "場次不存在" }, { status: 404 })
  if (event.status !== "open") return NextResponse.json({ error: "此場次目前不開放報名" }, { status: 400 })

  // Prevent duplicate application
  const existing = await prisma.circleEventApplication.findFirst({
    where: { circleId: session.id, eventApplicationId: Number(eventApplicationId) },
  })
  if (existing) return NextResponse.json({ error: "您已報名此場次" }, { status: 409 })

  const application = await prisma.circleEventApplication.create({
    data: {
      circleId: session.id,
      eventApplicationId: Number(eventApplicationId),
      tableType,
      adjacentRequest: adjacentRequest ?? "",
      note: note ?? "",
      status: "pending",
    },
  })

  const TABLE_LABELS: Record<string, string> = { half: "半桌", full: "全桌", large: "大桌" }

  await resend.emails.send({
    from: FROM,
    to: circle.email,
    subject: `【CWT】場次報名已送出 — ${event.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a0f14">
        <div style="background:#140810;padding:32px 40px;border-radius:12px 12px 0 0">
          <p style="color:#e8789a;font-size:11px;letter-spacing:0.4em;margin:0 0 8px">CIRCLE APPLICATION</p>
          <h1 style="color:white;font-size:22px;margin:0">場次報名已送出！</h1>
        </div>
        <div style="background:#fdf6f9;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #f0e4ea;border-top:none">
          <p style="margin:0 0 16px">您好，<strong>${circle.leaderName}</strong>，</p>
          <p style="margin:0 0 24px;color:#4a3a40;line-height:1.7">
            <strong>${circle.name}</strong> 的場次報名已送出，主辦單位審核後將以此信箱通知結果，請耐心等候。
          </p>
          <div style="background:white;border-radius:8px;padding:20px 24px;border:1px solid #f0e4ea;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:11px;color:#9a8590;letter-spacing:0.1em">報名資料摘要</p>
            <table style="font-size:13px;width:100%;border-collapse:collapse">
              <tr><td style="padding:4px 0;color:#8a7a80;width:90px">活動場次</td><td>${event.title}</td></tr>
              <tr><td style="padding:4px 0;color:#8a7a80">桌位類型</td><td>${TABLE_LABELS[tableType] ?? tableType}</td></tr>
              ${adjacentRequest ? `<tr><td style="padding:4px 0;color:#8a7a80">連攤申請</td><td>${adjacentRequest}</td></tr>` : ""}
            </table>
          </div>
          <p style="margin:0;font-size:12px;color:#b0a0a8">如有疑問，請直接回覆此封信件聯絡主辦。</p>
        </div>
      </div>
    `,
  }).catch(() => null)

  return NextResponse.json(application)
}

export async function GET() {
  const session = await getCircleSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const applications = await prisma.circleEventApplication.findMany({
    where: { circleId: session.id },
    orderBy: { createdAt: "desc" },
  })

  // Attach event info
  const eventIds = [...new Set(applications.map(a => a.eventApplicationId))]
  const events = await prisma.circleApplication.findMany({ where: { id: { in: eventIds } } })
  const eventMap = Object.fromEntries(events.map(e => [e.id, e]))

  return NextResponse.json(applications.map(a => ({ ...a, event: eventMap[a.eventApplicationId] ?? null })))
}
