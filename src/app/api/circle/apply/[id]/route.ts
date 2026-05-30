import { NextResponse } from "next/server"
import { getCircleSession } from "@/lib/circle-auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCircleSession()
  if (!session) return NextResponse.json({ error: "請先登入" }, { status: 401 })

  const { id } = await params
  const app = await prisma.circleEventApplication.findUnique({ where: { id: Number(id) } })

  if (!app) return NextResponse.json({ error: "找不到報名記錄" }, { status: 404 })
  if (app.circleId !== session.id) return NextResponse.json({ error: "無權操作" }, { status: 403 })
  if (app.status !== "pending") return NextResponse.json({ error: "僅可取消審核中的報名" }, { status: 400 })

  await prisma.circleEventApplication.update({ where: { id: Number(id) }, data: { status: "cancelled" } })
  return NextResponse.json({ ok: true })
}
