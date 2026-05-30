import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createCircleToken, CIRCLE_COOKIE } from "@/lib/circle-auth"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: "請填寫信箱與密碼" }, { status: 400 })

  const circle = await prisma.circle.findUnique({ where: { email } })
  if (!circle) return NextResponse.json({ error: "信箱或密碼錯誤" }, { status: 401 })

  const ok = await bcrypt.compare(password, circle.password)
  if (!ok) return NextResponse.json({ error: "信箱或密碼錯誤" }, { status: 401 })

  const token = createCircleToken(circle.id, circle.email)
  const res = NextResponse.json({ ok: true, status: circle.status, name: circle.name })
  res.cookies.set(CIRCLE_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  })
  return res
}
