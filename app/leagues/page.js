import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import GeneralLeagueCard from "@/components/leagues/GeneralLeagueCard"
import PrivateLeagueCard from "@/components/leagues/PrivateLeagueCard"

export default async function LeaguesPage() {
    const session = await auth()

    if (!session?.user) redirect("/login")

    const userId = session.user.id

    const generalLeague = await prisma.league.findFirst({
        where: { type: "GENERAL_PAID" },
        include: {
            members: { where: { userId } },
            _count: { select: { members: true } },
        },
    })

    const isInGeneralLeague = (generalLeague?.members?.length ?? 0) > 0
    const hasPaid = session.user.hasPaid ?? false

    const privateLeagues = await prisma.leagueMember.findMany({
        where: {
            userId,
            league: { type: "PRIVATE_FREE" },
        },
        include: {
            league: {
                include: {
                    _count: { select: { members: true } },
                    owner: { select: { name: true } },
                },
            },
        },
        orderBy: { joinedAt: "desc" },
    })

    return (
        <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 sm:px-6 py-16">

            {/* Acento superior de marca */}
            <div
                aria-hidden="true"
                className="fixed top-14 left-0 right-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, #fe3d12 0%, transparent 40%)" }}
            />

            {/* Cards centradas */}
            <div className="w-full max-w-xl flex flex-col gap-4">
                <GeneralLeagueCard
                    league={generalLeague}
                    isInLeague={isInGeneralLeague}
                    hasPaid={hasPaid}
                    memberCount={generalLeague?._count?.members ?? 0}
                />
            </div>

        </main>
    )
}