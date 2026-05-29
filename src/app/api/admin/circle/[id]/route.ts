import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const item = await prisma.circleApplication.findUnique({ where: { id: Number(id) } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { title, edition, location, venue, eventDateStart, eventDateEnd, regOpen, regClose, status, priceHalf, priceFull, priceLarge, description, published, sortOrder } = await req.json()
  const item = await prisma.circleApplication.update({
    where: { id: Number(id) },
    data: { title, edition, location, venue, eventDateStart, eventDateEnd, regOpen, regClose, status, priceHalf, priceFull, priceLarge, description, published, sortOrder },
  })
  return NextResponse.json(item)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.circleApplication.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
