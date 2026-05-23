const ENTRIES = [
  { title: "社團報名", sub: "CIRCLE", bg: "#f0d8e4", dark: false },
  { title: "一般入場", sub: "ATTEND", bg: "#1a0f14", dark: true },
  { title: "活動規則", sub: "RULES", bg: "#2a1a24", dark: true },
  { title: "新手上路", sub: "GUIDE", bg: "#f5e8ee", dark: false },
]

export default function QuickEntry() {
  return (
    <section className="px-8 py-10" style={{ background: "#f8f0f4" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-bold" style={{ color: "#1a0f14" }}>快速入口</h2>
          <span className="text-[10px] tracking-[0.3em]" style={{ color: "#9a8590" }}>QUICK ENTRY</span>
        </div>
        <button className="text-sm transition-colors" style={{ color: "#9a8590" }}>→</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {ENTRIES.map(({ title, sub, bg, dark }) => (
          <button
            key={title}
            className="rounded-2xl p-5 text-left flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: bg, aspectRatio: "4/3" }}
          >
            <div />
            <div>
              <div
                className="text-base font-bold leading-tight"
                style={{ color: dark ? "white" : "#1a0f14" }}
              >
                {title}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span
                  className="text-[9px] tracking-widest"
                  style={{ color: dark ? "rgba(255,255,255,0.4)" : "#9a8590" }}
                >
                  {sub}
                </span>
                <span
                  className="text-base"
                  style={{ color: dark ? "rgba(255,255,255,0.5)" : "#c0a0b0" }}
                >
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
