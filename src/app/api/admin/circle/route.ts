import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items = await prisma.circleApplication.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, edition, location, venue, eventDateStart, eventDateEnd, regOpen, regClose, status, priceHalf, priceFull, priceLarge, description, published, sortOrder } = await req.json()
  const item = await prisma.circleApplication.create({
    data: { title, edition, location, venue, eventDateStart, eventDateEnd, regOpen, regClose, status, priceHalf, priceFull, priceLarge, description, published, sortOrder },
  })
  return NextResponse.json(item)
}
