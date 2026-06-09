import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import UpcomingMatches from "@/components/landing/UpcomingMatches"

export default async function HomePage() {
  const session = await auth()

  const upcomingMatches = await prisma.match.findMany({
    where: { status: "SCHEDULED" },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { matchDate: "asc" },
    take: 5,
  })

  return (
    <main className="flex flex-col">
      <Hero isLoggedIn={!!session?.user} />
      <HowItWorks />
      <UpcomingMatches matches={upcomingMatches} />
    </main>
  )
}