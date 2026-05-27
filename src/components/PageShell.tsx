"use client"
import { motion } from "framer-motion"
import NavRail from "./NavRail"

export default function PageShell({
  titleEn,
  title,
  subtitle,
  children,
}: {
  titleEn: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "#fdf6f9" }}>
      <NavRail />
      <main className="flex-1 ml-[140px]">
        {/* Dark hero strip */}
        <div className="relative px-10 pt-12 pb-10 overflow-hidden" style={{ background: "#140810" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(232,120,154,0.09) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, rgba(232,120,154,0.3), transparent 70%)" }} />
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="text-[10px] tracking-[0.45em] mb-2 font-medium" style={{ color: "#e8789a" }}>{titleEn}</div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: "white" }}>{title}</h1>
            {subtitle && <p className="text-sm mt-2 max-w-lg" style={{ color: "rgba(255,255,255,0.45)" }}>{subtitle}</p>}
          </motion.div>
        </div>

        {/* Light content area */}
        <div className="px-10 py-8">{children}</div>
      </main>
    </div>
  )
}
