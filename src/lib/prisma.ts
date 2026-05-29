import { PrismaClient } from "@/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createClient(): PrismaClient | null {
  try {
    const url = process.env.DATABASE_URL ?? "file:/tmp/cwt.db"
    const adapter = new PrismaBetterSqlite3({ url })
    return new PrismaClient({ adapter } as never)
  } catch {
    return null
  }
}

const client = globalForPrisma.prisma ?? createClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client ?? undefined

export const prisma = client as PrismaClient
