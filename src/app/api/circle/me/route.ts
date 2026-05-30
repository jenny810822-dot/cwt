import { NextResponse } from "next/server"
import { getCircleSession } from "@/lib/circle-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getCircleSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const circle = await prisma.circle.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, leaderName: true, email: true, phone: true, type: true, genres: true, portfolioUrl: true, snsUrl: true, status: true, createdAt: true },
  })
  if (!circle) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(circle)
}
