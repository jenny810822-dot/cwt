import NavRail from "@/components/NavRail"
import HeroSection from "@/components/HeroSection"
import QuickEntry from "@/components/QuickEntry"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const event = await prisma.event.findFirst({ orderBy: { id: "desc" } })
  return (
    <div className="flex min-h-screen bg-[#140810]">
      <NavRail />
      <main className="flex-1 ml-[140px]">
        <HeroSection heroImage={event?.heroImage ?? undefined} />
        <QuickEntry />
      </main>
    </div>
  )
}
