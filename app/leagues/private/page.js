import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import PrivateLeagueCard from "@/components/leagues/PrivateLeagueCard"

export default async function PrivateLeaguesPage() {
    const session = await auth()

    if (!session?.user) redirect("/login")

    const userId = session.user.id

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

            {/* Acento de marca bajo el navbar */}
            <div
                aria-hidden="true"
                className="fixed top-14 left-0 right-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, #fe3d12 0%, transparent 40%)" }}
            />

            <div className="w-full max-w-md">
                <PrivateLeagueCard privateLeagues={privateLeagues} />
            </div>

        </main>
    )
}