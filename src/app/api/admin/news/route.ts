import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const news = await prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(news)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const raw = await req.json()
  const { date, title, tag, tagColor, body, coverImage, link, published, sortOrder } = raw
  const item = await prisma.newsItem.create({
    data: { date, title, tag, tagColor, body, coverImage, link, published, sortOrder },
  })
  return NextResponse.json(item)
}
