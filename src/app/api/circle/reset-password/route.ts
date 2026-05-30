import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: "缺少必要資料" }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: "密碼至少 6 個字元" }, { status: 400 })

  const circle = await prisma.circle.findFirst({
    where: { resetToken: token },
  })

  if (!circle || !circle.resetTokenExpiry) {
    return NextResponse.json({ error: "連結無效或已過期" }, { status: 400 })
  }

  if (new Date(circle.resetTokenExpiry) < new Date()) {
    return NextResponse.json({ error: "連結已過期，請重新申請" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.circle.update({
    where: { id: circle.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  })

  return NextResponse.json({ ok: true })
}
