import NavRail from "@/components/NavRail"
import HeroSection from "@/components/HeroSection"
import QuickEntry from "@/components/QuickEntry"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#140810]">
      <NavRail />
      <main className="flex-1 ml-[140px]">
        <HeroSection />
        <QuickEntry />
      </main>
    </div>
  )
}
