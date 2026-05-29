import CircleForm from "../CircleForm"

export default function NewCirclePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#1a0f14" }}>新增場次</h1>
        <p className="text-sm mt-1" style={{ color: "#8a7a80" }}>建立新的社團報名場次</p>
      </div>
      <CircleForm />
    </div>
  )
}
