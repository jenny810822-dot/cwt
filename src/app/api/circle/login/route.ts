import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createCircleToken, CIRCLE_COOKIE } from "@/lib/circle-auth"
import { rateLimit, getIp } from "@/lib/rate-limit"

export async function POST(req: Request) {
  // 5 次 / 15 分鐘 per IP
  const { ok, retryAfterSec } = rateLimit(`login:${getIp(req)}`, 5, 15 * 60 * 1000)
  if (!ok) {
    return NextResponse.json(
      { error: `嘗試次數過多，請 ${Math.ceil(retryAfterSec / 60)} 分鐘後再試` },
      { status: 429 }
    )
  }

  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: "請填寫信箱與密碼" }, { status: 400 })

  const circle = await prisma.circle.findUnique({ where: { email } })
  if (!circle) return NextResponse.json({ error: "信箱或密碼錯誤" }, { status: 401 })

  const ok2 = await bcrypt.compare(password, circle.password)
  if (!ok2) return NextResponse.json({ error: "信箱或密碼錯誤" }, { status: 401 })

  if (circle.status === "rejected") {
    return NextResponse.json({ error: "帳號申請未通過，如有疑問請聯絡主辦" }, { status: 403 })
  }

  const token = createCircleToken(circle.id, circle.email)
  const res = NextResponse.json({ ok: true, status: circle.status, name: circle.name })
  res.cookies.set(CIRCLE_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  })
  return res
}
