"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import CountdownWidget from "./Countdown"
import MusicWidget from "./MusicWidget"
import NewsWidget from "./NewsWidget"

const PETALS = [
  { top: "14%", left: "38%", size: 8, delay: 0 },
  { top: "28%", left: "60%", size: 5, delay: 0.8 },
  { top: "52%", left: "43%", size: 6, delay: 1.5 },
  { top: "19%", left: "68%", size: 4, delay: 0.4 },
  { top: "67%", left: "55%", size: 7, delay: 1.2 },
  { top: "40%", left: "33%", size: 4, delay: 2.0 },
  { top: "75%", left: "48%", size: 5, delay: 0.6 },
]

export default function HeroSection({ heroImage }: { heroImage?: string }) {
  return (
    <section className="relative overflow-hidden" style={{ height: "100vh", background: "#1c0f18" }}>

      {/* Character image (from admin upload) */}
      {heroImage ? (
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <div className="relative h-full" style={{ width: "55%", right: "-5%" }}>
            <Image
              src={heroImage}
              alt="主視覺角色"
              fill
              className="object-contain object-bottom"
              priority
              unoptimized
            />
          </div>
        </div>
      ) : (
        /* CSS glow placeholder when no image */
        <>
          <div
            className="absolute rounded-full"
            style={{
              top: "50%", left: "45%",
              width: 480, height: 580,
              transform: "translate(-50%, -50%)",
              background: "rgba(232,120,154,0.13)",
              filter: "blur(120px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "22%", left: "52%",
              width: 240, height: 300,
              background: "rgba(196,85,120,0.10)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "8%", left: "34%",
              width: 320, height: 200,
              background: "rgba(245,198,216,0.07)",
              filter: "blur(60px)",
            }}
          />
        </>
      )}

      {/* Gradient overlay left — always on top of image for text legibility */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, #140810 0%, rgba(28,15,24,0.7) 45%, rgba(28,15,24,0.15) 100%)" }}
      />

      {/* CWT watermark */}
      <div
        className="absolute bottom-16 pointer-events-none select-none"
        style={{ left: "14%" }}
      >
        <div className="font-black leading-none" style={{ fontSize: 160, color: "rgba(255,255,255,0.035)" }}>CWT</div>
        <div className="font-black leading-none -mt-6" style={{ fontSize: 90, color: "rgba(255,255,255,0.045)" }}>68th</div>
        <div className="tracking-[0.5em] mt-2" style={{ fontSize: 14, color: "rgba(255,255,255,0.035)" }}>台灣同人誌販售會</div>
      </div>

      {/* Floating petals */}
      {PETALS.map(({ top, left, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ top, left, width: size, height: size, background: "rgba(232,120,154,0.4)" }}
          animate={{ y: [0, -16, 0], opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}

      {/* Top right controls */}
      <div className="absolute top-6 right-6 flex items-center gap-5 z-20" style={{ color: "rgba(255,255,255,0.45)" }}>
        <button className="text-sm hover:text-white transition-colors">🔍</button>
        <span className="text-[11px] tracking-widest font-medium hover:text-white transition-colors cursor-pointer">MENU</span>
        <button className="text-xl hover:text-white transition-colors">≡</button>
      </div>
      <div
        className="absolute top-6 z-20 text-[10px] tracking-widest"
        style={{ right: "9rem", color: "rgba(255,255,255,0.25)" }}
      >
        CW68
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex">
        {/* Left: Event info */}
        <div className="flex-1 flex flex-col justify-end pb-16 pl-10 pr-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[11px] tracking-[0.3em] mb-8 font-medium" style={{ color: "#e8789a" }}>
              ★ 2025
            </div>

            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-black leading-none tracking-tight" style={{ fontSize: 68, color: "#e8789a" }}>
                12.27
              </span>
              <span className="text-xl" style={{ color: "rgba(255,255,255,0.6)" }}>（六）</span>
            </div>
            <div className="mb-8 flex items-baseline gap-3">
              <span className="font-black leading-none tracking-tight" style={{ fontSize: 68, color: "#e8789a" }}>
                12.28
              </span>
              <span className="text-xl" style={{ color: "rgba(255,255,255,0.6)" }}>（日）</span>
            </div>

            <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              10:30 — 16:30
            </div>
            <div className="flex items-center gap-1.5 text-sm mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>📍</span>
              <span>台大綜合體育館 1F & B1</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-full text-sm font-medium flex items-center gap-2 w-fit transition-colors duration-300"
              style={{
                background: "#1a0f14",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#e8789a"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#e8789a"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#1a0f14"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"
              }}
            >
              活動資訊 VIEW MORE →
            </motion.button>
          </motion.div>

          <div className="mt-12">
            <div className="text-[9px] tracking-[0.4em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              FOLLOW US
            </div>
            <div className="flex gap-4">
              {["IG", "X", "FB", "LINE"].map(s => (
                <button
                  key={s}
                  className="text-[11px] font-medium tracking-wider transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#e8789a")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Widget column */}
        <div className="w-[360px] flex flex-col gap-3 pt-16 pb-8 pr-6 overflow-y-auto">
          <CountdownWidget />
          <MusicWidget />
          <NewsWidget />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 80, background: "linear-gradient(to top, #140810, transparent)" }}
      />
    </section>
  )
}
