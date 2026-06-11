import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import LeagueTabs from "@/components/leagues/league/LeagueTabs"
import CopyCodeButton from "@/components/leagues/league/Copycodebutton"

export default async function LeaguePage({ params }) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const { id } = await params
    const userId = session.user.id

    const league = await prisma.league.findUnique({
        where: { id },
        include: {
            owner: { select: { name: true } },
            _count: { select: { members: true } },
        },
    })

    if (!league) notFound()

    const membership = await prisma.leagueMember.findUnique({
        where: {
            leagueId_userId: { leagueId: id, userId },
        },
    })

    if (!membership) redirect("/leagues")

    const matches = await prisma.match.findMany({
        include: {
            homeTeam: true,
            awayTeam: true,
        },
        orderBy: { matchDate: "asc" },
    })

    const predictionsRaw = await prisma.prediction.findMany({
        where: { userId },
    })

    const predictions = predictionsRaw.reduce((acc, p) => {
        acc[p.matchId] = p
        return acc
    }, {})

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

    const isPrivate = league.type === "PRIVATE_FREE"
    const isGeneral = league.type === "GENERAL_PAID"

    return (
        <main className="min-h-screen bg-zinc-950">

            {/* ── Franja de acento superior ─────────────────────────────── */}
            <div
                aria-hidden="true"
                className="h-px w-full"
                style={{ background: "linear-gradient(90deg, #fe3d12 0%, transparent 50%)" }}
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-10">

                {/* ── Header de la liga ─────────────────────────────────── */}
                <header className="flex flex-col gap-4">

                    {/* Badge de tipo */}
                    <div className="flex items-center gap-3">
                        <span
                            className="inline-flex items-center font-sans text-[10px] font-medium tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border"
                            style={
                                isGeneral
                                    ? { color: "#fe3d12", borderColor: "#fe3d1230", background: "#fe3d1210" }
                                    : { color: "#737373", borderColor: "#27272a", background: "transparent" }
                            }
                        >
                            {isGeneral ? "Liga General" : "Liga Privada"}
                        </span>

                        {/* Código de invitación para ligas privadas */}
                        {isPrivate && league.code && (
                            <CopyCodeButton code={league.code} />
                        )}
                    </div>

                    {/* Nombre */}
                    <div className="flex flex-col gap-1">
                        <h1 className="font-heading text-4xl sm:text-5xl text-white tracking-wide leading-none">
                            {league.name.toUpperCase()}
                        </h1>
                    </div>

                    {/* Meta-info */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <span className="font-sans text-sm text-zinc-500">
                                {league._count.members}
                                <span className="text-zinc-700"> participantes</span>
                            </span>
                        </div>

                        {league.owner?.name && (
                            <>
                                <div className="w-px h-3 bg-zinc-800" aria-hidden="true" />
                                <span className="font-sans text-sm text-zinc-700">
                                    Creada por{" "}
                                    <span className="text-zinc-500">{league.owner.name}</span>
                                </span>
                            </>
                        )}
                    </div>

                    {/* Divisor */}
                    <div className="h-px bg-zinc-900 mt-2" aria-hidden="true" />
                </header>

                {/* ── Tabs ──────────────────────────────────────────────── */}
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