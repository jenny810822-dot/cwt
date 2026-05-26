import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "只接受 JPG、PNG、WebP、GIF" }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "檔案大小不能超過 10MB" }, { status: 400 })

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const filename = `hero-${Date.now()}.${ext}`
  const uploadDir = path.join(process.cwd(), "public", "uploads")

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/uploads/${filename}` })
}
