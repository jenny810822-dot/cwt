import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const entries = await prisma.quickEntry.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(entries)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, image } = await req.json()
  try {
    const entry = await prisma.quickEntry.update({ where: { id }, data: { image } })
    return NextResponse.json(entry)
  } catch (e) {
    console.error("[quickentry PUT]", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
