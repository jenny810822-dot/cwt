"use client"
import { useState, useEffect } from "react"
import Widget from "./Widget"

export default function CountdownWidget({ target }: { target?: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const ms = target ? new Date(target).getTime() : new Date("2025-12-27T10:30:00+08:00").getTime()
    const tick = () => {
      const diff = Math.max(0, ms - Date.now())
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const pad = (n: number) => String(n).padStart(2, "0")
  const units = [
    { value: t.d, label: "DAYS" },
    { value: t.h, label: "HRS" },
    { value: t.m, label: "MINS" },
    { value: t.s, label: "SECS" },
  ]

  return (
    <Widget title="活動倒數" subtitle="COUNTDOWN">
      <div className="flex justify-between">
        {units.map(({ value, label }) => (
          <div key={label} className="flex-1 text-center">
            <div
              className="text-2xl font-black tabular-nums leading-none tracking-tight"
              style={{ color: "#1a0f14" }}
            >
              {pad(value)}
            </div>
            <div className="text-[9px] mt-1 tracking-widest" style={{ color: "#9a8590" }}>{label}</div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
