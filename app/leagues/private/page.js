import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import PrivateLeagueCard from "@/components/leagues/PrivateLeagueCard";

export default async function PrivateLeaguesPage() {
    const session = await auth()

    if (!session?.user) redirect("/login")

    const userId = session.user.id

    // Ligas privadas del usuario
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
        <PrivateLeagueCard privateLeagues={privateLeagues} />
    )
}