import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const news = await prisma.newsItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })
  return NextResponse.json(news)
}
