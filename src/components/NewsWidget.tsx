import Widget from "./Widget"

const NEWS = [
  { date: "05.20", title: "【CW68】社團報名資訊公告", tag: "重要", tagBg: "#e8789a" },
  { date: "05.18", title: "【CW68】活動主視覺公開！", tag: "NEW", tagBg: "#c45578" },
  { date: "05.10", title: "【場地資訊】台大綜合體育館交通指南", tag: null, tagBg: "" },
  { date: "05.02", title: "【新手指南】第一次參加CWT就看這裡！", tag: null, tagBg: "" },
]

export default function NewsWidget() {
  return (
    <Widget title="最新消息" subtitle="NEWS" action={{ label: "MORE", href: "/news" }} delay={0.2}>
      <div className="flex flex-col">
        {NEWS.map(({ date, title, tag, tagBg }) => (
          <div
            key={title}
            className="flex items-center gap-2 py-2 cursor-pointer group"
            style={{ borderBottom: "1px solid #f0e8ec" }}
          >
            <span className="text-[10px] w-9 flex-shrink-0" style={{ color: "#b0a0a8" }}>{date}</span>
            <span
              className="text-[11px] flex-1 leading-tight truncate transition-colors duration-200"
              style={{ color: "#2a1a20" }}
            >
              {title}
            </span>
            {tag && (
              <span
                className="text-[8px] text-white px-1.5 py-0.5 rounded font-bold flex-shrink-0"
                style={{ background: tagBg }}
              >
                {tag}
              </span>
            )}
            <span className="text-sm flex-shrink-0" style={{ color: "#c0b0b8" }}>›</span>
          </div>
        ))}
      </div>
    </Widget>
  )
}
