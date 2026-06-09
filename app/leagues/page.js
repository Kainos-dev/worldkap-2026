import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import GeneralLeagueCard from "@/components/leagues/GeneralLeagueCard"
import PrivateLeagueCard from "@/components/leagues/PrivateLeagueCard"

export default async function LeaguesPage() {
    const session = await auth()

    if (!session?.user) redirect("/login")

    const userId = session.user.id

    // Liga general
    const generalLeague = await prisma.league.findFirst({
        where: { type: "GENERAL_PAID" },
        include: {
            members: { where: { userId } },
            _count: { select: { members: true } },
        },
    })

    const isInGeneralLeague = (generalLeague?.members?.length ?? 0) > 0
    const hasPaid = session.user.hasPaid ?? false

    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-12">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">

                {/* Header */}
                <div>
                    <h1 className="font-bebas text-5xl text-white tracking-wide">
                        TUS LIGAS
                    </h1>
                    <p className="font-inter text-zinc-400 text-sm mt-2">
                        Elegí dónde querés competir
                    </p>
                </div>

                {/* Cards principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GeneralLeagueCard
                        league={generalLeague}
                        isInLeague={isInGeneralLeague}
                        hasPaid={hasPaid}
                        memberCount={generalLeague?._count?.members ?? 0}
                    />
                </div>

            </div>
        </main>
    )
}