import NewsForm from "../NewsForm"

export default function NewNewsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>新增消息</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>新增一則首頁公告</p>
      </div>
      <NewsForm />
    </div>
  )
}
