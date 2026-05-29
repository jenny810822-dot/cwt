"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Widget from "./Widget"

type NewsItem = {
  id: number
  date: string
  title: string
  tag: string | null
  tagColor: string | null
}

export default function NewsWidget() {
  const [items, setItems] = useState<NewsItem[]>([])

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => setItems((data as NewsItem[]).slice(0, 4)))
      .catch(() => {})
  }, [])

  return (
    <Widget title="最新消息" subtitle="NEWS" action={{ label: "MORE", href: "/news" }} delay={0.2}>
      <div className="flex flex-col">
        {items.map(({ id, date, title, tag, tagColor }) => (
          <Link
            key={id}
            href={`/news/${id}`}
            className="flex items-center gap-2 py-2 group"
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
                style={{ background: tagColor ?? "#e8789a" }}
              >
                {tag}
              </span>
            )}
            <span className="text-sm flex-shrink-0" style={{ color: "#c0b0b8" }}>›</span>
          </Link>
        ))}
        {items.length === 0 && (
          <div className="py-4 text-center text-[11px]" style={{ color: "#b0a0a8" }}>暫無消息</div>
        )}
      </div>
    </Widget>
  )
}
