import { NextResponse } from "next/server"
import { CIRCLE_COOKIE } from "@/lib/circle-auth"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(CIRCLE_COOKIE, "", { maxAge: 0, path: "/" })
  return res
}
