import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { hashSync } from "bcryptjs"

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter } as never)

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@cwt.tw" },
    update: {},
    create: {
      name: "管理員",
      email: "admin@cwt.tw",
      password: hashSync("cwt@admin2025", 10),
      role: "admin",
    },
  })

  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      edition: 68,
      dateStart: "2025-12-27",
      dateEnd: "2025-12-28",
      venue: "台大綜合體育館 1F & B1",
      accentColor: "#e8789a",
    },
  })

  const existingNews = await prisma.newsItem.count()
  if (existingNews === 0) {
    await prisma.newsItem.createMany({
      data: [
        { date: "05.20", title: "【CW68】社團報名資訊公告", tag: "重要", tagColor: "#e8789a", sortOrder: 1 },
        { date: "05.18", title: "【CW68】活動主視覺公開！", tag: "NEW", tagColor: "#c45578", sortOrder: 2 },
        { date: "05.10", title: "【場地資訊】台大綜合體育館交通指南", sortOrder: 3 },
        { date: "05.02", title: "【新手指南】第一次參加CWT就看這裡！", sortOrder: 4 },
      ],
    })
  }

  console.log("✓ Seed 完成")
  console.log("  帳號：admin@cwt.tw")
  console.log("  密碼：cwt@admin2025")
}

main().finally(() => prisma.$disconnect())
