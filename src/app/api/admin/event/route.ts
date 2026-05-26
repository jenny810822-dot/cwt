import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const event = await prisma.event.findFirst({ orderBy: { id: "desc" } })
  return NextResponse.json(event)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await req.json()
  const event = await prisma.event.upsert({
    where: { id: data.id ?? 1 },
    update: data,
    create: data,
  })
  return NextResponse.json(event)
}
