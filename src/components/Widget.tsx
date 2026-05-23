"use client"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface Props {
  title: string
  subtitle?: string
  action?: { label: string; href: string }
  delay?: number
  children: ReactNode
}

export default function Widget({ title, subtitle, action, delay = 0, children }: Props) {
  return (
    <motion.div
      className="widget p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-semibold" style={{ color: "#1a0f14" }}>{title}</span>
          {subtitle && (
            <span className="text-[10px] tracking-wider" style={{ color: "#9a8590" }}>{subtitle}</span>
          )}
        </div>
        {action && (
          <a href={action.href} className="text-[10px] font-medium hover:underline" style={{ color: "#e8789a" }}>
            {action.label} →
          </a>
        )}
      </div>
      {children}
    </motion.div>
  )
}
