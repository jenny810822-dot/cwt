import type { Metadata } from "next"
import { Noto_Sans_TC } from "next/font/google"
import "./globals.css"

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tc",
})

export const metadata: Metadata = {
  title: "CWT — 台灣同人誌販售會",
  description: "Taiwan Comic World 台灣最大同人誌販售活動",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} h-full`}>
      <body className="min-h-full" style={{ fontFamily: "var(--font-tc), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
