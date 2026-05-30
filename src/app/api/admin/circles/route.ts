import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const circles = await prisma.circle.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, leaderName: true, email: true, phone: true, type: true, genres: true, portfolioUrl: true, snsUrl: true, note: true, status: true, createdAt: true },
  })
  return NextResponse.json(circles)
}
