import crypto from "crypto"
import { cookies } from "next/headers"

const COOKIE = "circle-session"
const SECRET = process.env.NEXTAUTH_SECRET ?? "cwt-circle-secret"

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url")
}

export function createCircleToken(id: number, email: string): string {
  const payload = Buffer.from(JSON.stringify({ id, email, iat: Date.now() })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function verifyCircleToken(token: string): { id: number; email: string } | null {
  const [payload, sig] = token.split(".")
  if (!payload || !sig || sign(payload) !== sig) return null
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString())
  } catch {
    return null
  }
}

export async function getCircleSession(): Promise<{ id: number; email: string } | null> {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (!token) return null
  return verifyCircleToken(token)
}

export const CIRCLE_COOKIE = COOKIE
