import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import NewsForm from "../NewsForm"

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.newsItem.findUnique({ where: { id: Number(id) } })
  if (!item) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>編輯消息</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>修改消息內容</p>
      </div>
      <NewsForm initialData={item} />
    </div>
  )
}
