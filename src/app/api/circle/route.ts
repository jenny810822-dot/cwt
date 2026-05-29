import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.circleApplication.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }).catch(() => [])
  return NextResponse.json(items)
}
