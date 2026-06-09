import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import LeagueTabs from "@/components/leagues/league/LeagueTabs"

export default async function LeaguePage({ params }) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const { id } = await params
    const userId = session.user.id

    // Verificar que la liga existe
    const league = await prisma.league.findUnique({
        where: { id },
        include: {
            owner: { select: { name: true } },
            _count: { select: { members: true } },
        },
    })

    if (!league) notFound()

    // Verificar que el usuario es miembro
    const membership = await prisma.leagueMember.findUnique({
        where: {
            leagueId_userId: { leagueId: id, userId },
        },
    })

    if (!membership) redirect("/leagues")

    // Partidos con equipos
    const matches = await prisma.match.findMany({
        include: {
            homeTeam: true,
            awayTeam: true,
        },
        orderBy: { matchDate: "asc" },
    })

    // Predicciones del usuario
    const predictionsRaw = await prisma.prediction.findMany({
        where: { userId },
    })

    const predictions = predictionsRaw.reduce((acc, p) => {
        acc[p.matchId] = p
        return acc
    }, {})

    // Ranking de la liga
    const members = await prisma.leagueMember.findMany({
        where: { leagueId: id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    })

    // Calcular puntos por miembro sumando sus predictions
    const memberIds = members.map((m) => m.userId)

    const pointsByUser = await prisma.prediction.groupBy({
        by: ["userId"],
        where: { userId: { in: memberIds } },
        _sum: { points: true },
    })

    const pointsMap = pointsByUser.reduce((acc, p) => {
        acc[p.userId] = p._sum.points ?? 0
        return acc
    }, {})

    const ranking = members
        .map((m) => ({
            userId: m.userId,
            name: m.user.name,
            image: m.user.image,
            points: pointsMap[m.userId] ?? 0,
            isCurrentUser: m.userId === userId,
        }))
        .sort((a, b) => b.points - a.points)
        .map((m, i) => ({ ...m, position: i + 1 }))

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <span className="font-inter text-xs text-zinc-500 tracking-widest uppercase">
                        {league.type === "GENERAL_PAID" ? "Liga General" : "Liga Privada"}
                    </span>
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        {league.name.toUpperCase()}
                    </h1>
                    <p className="font-inter text-zinc-500 text-sm">
                        {league._count.members} participantes
                    </p>
                </div>

                {/* Tabs con toda la lógica */}
                <LeagueTabs
                    matches={matches}
                    predictions={predictions}
                    ranking={ranking}
                    league={league}
                    currentUserId={userId}
                />

            </div>
        </main>
    )
}