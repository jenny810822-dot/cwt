"use client"
import { useState } from "react"
import Widget from "./Widget"

export default function MusicWidget() {
  const [playing, setPlaying] = useState(false)

  return (
    <Widget title="CW68 主題曲" subtitle="Theme Song" delay={0.1}>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md"
          style={{ background: "linear-gradient(135deg, #e8789a, #c45578)" }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold truncate" style={{ color: "#1a0f14" }}>CW68 主題曲</div>
          <button
            onClick={() => setPlaying(p => !p)}
            className="flex items-center gap-1.5 text-[11px] font-medium mt-0.5"
            style={{ color: "#e8789a" }}
          >
            <span>{playing ? "⏸" : "▶"}</span>
            <span>{playing ? "正在播放" : "PLAY NOW"}</span>
          </button>

          <div className="flex items-center gap-[2px] mt-2 h-5">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className="w-[2px] rounded-full transition-all duration-300"
                style={{
                  height: `${25 + Math.abs(Math.sin(i * 0.7 + 1)) * 75}%`,
                  background: playing ? "#e8789a" : "#d8c8ce",
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ background: "#1a0f14", boxShadow: "0 0 0 3px #3a2a30" }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: "#3a2a30", boxShadow: "0 0 0 1px #5a4050" }}
          />
        </div>
      </div>
    </Widget>
  )
}
