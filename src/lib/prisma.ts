import { PrismaClient } from "@/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient(): PrismaClient | null {
  try {
    const url = process.env.DATABASE_URL
    if (!url) return null
    const authToken = process.env.TURSO_AUTH_TOKEN
    const adapter = new PrismaLibSql({ url, authToken })
    return new PrismaClient({ adapter } as never)
  } catch {
    return null
  }
}

const client = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client ?? undefined

export const prisma = client as PrismaClient
