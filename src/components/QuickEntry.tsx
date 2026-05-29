import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

export default async function QuickEntry() {
  const entries = await prisma?.quickEntry.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => null) ?? []

  return (
    <section className="px-8 py-10" style={{ background: "#f8f0f4" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-bold" style={{ color: "#1a0f14" }}>快速入口</h2>
          <span className="text-[10px] tracking-[0.3em]" style={{ color: "#9a8590" }}>QUICK ENTRY</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {entries.map(({ id, title, subtitle, link, bgColor, dark, image }) => (
          <Link
            key={id}
            href={link}
            className="rounded-2xl text-left flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative"
            style={{ background: bgColor, aspectRatio: "4/3" }}
          >
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            )}
            {/* Overlay for text legibility when image is present */}
            {image && (
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
              />
            )}
            <div className="relative z-10 p-5 flex flex-col justify-between h-full">
              <div />
              <div>
                <div
                  className="text-base font-bold leading-tight"
                  style={{ color: image ? "white" : dark ? "white" : "#1a0f14" }}
                >
                  {title}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="text-[9px] tracking-widest"
                    style={{ color: image ? "rgba(255,255,255,0.6)" : dark ? "rgba(255,255,255,0.4)" : "#9a8590" }}
                  >
                    {subtitle}
                  </span>
                  <span
                    className="text-base"
                    style={{ color: image ? "rgba(255,255,255,0.7)" : dark ? "rgba(255,255,255,0.5)" : "#c0a0b0" }}
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
