import { prisma } from "@/lib/prisma"
import Link from "next/link"
import MatchActions from "./MatchActions"

const STAGE_LABELS = {
    GROUP: "Fase de grupos",
    ROUND_OF_32: "Ronda de 32",
    ROUND_OF_16: "Octavos de final",
    QUARTER_FINAL: "Cuartos de final",
    SEMI_FINAL: "Semifinal",
    THIRD_PLACE: "Tercer puesto",
    FINAL: "Final",
}

const STAGE_ORDER = [
    "GROUP",
    "ROUND_OF_32",
    "ROUND_OF_16",
    "QUARTER_FINAL",
    "SEMI_FINAL",
    "THIRD_PLACE",
    "FINAL",
]

const STATUS_STYLES = {
    SCHEDULED: "bg-zinc-700/50 text-zinc-400",
    LIVE: "bg-green-500/20 text-green-400",
    FINISHED: "bg-zinc-800 text-zinc-500",
    POSTPONED: "bg-yellow-500/20 text-yellow-400",
}

const STATUS_LABELS = {
    SCHEDULED: "Programado",
    LIVE: "En vivo",
    FINISHED: "Finalizado",
    POSTPONED: "Postergado",
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default async function AdminMatchesPage() {
    const matches = await prisma.match.findMany({
        orderBy: { matchNumber: "asc" },
        include: {
            homeTeam: true,
            awayTeam: true,
            _count: { select: { predictions: true } },
        },
    })

    const matchesByStage = matches.reduce((acc, match) => {
        if (!acc[match.stage]) acc[match.stage] = []
        acc[match.stage].push(match)
        return acc
    }, {})

    const finished = matches.filter((m) => m.status === "FINISHED").length
    const live = matches.filter((m) => m.status === "LIVE").length

    return (
        <div className="flex flex-col gap-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        PARTIDOS
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="font-inter text-zinc-500 text-sm">
                            {matches.length} totales
                        </span>
                        <span className="font-inter text-zinc-600 text-sm">·</span>
                        <span className="font-inter text-zinc-500 text-sm">
                            {finished} finalizados
                        </span>
                        {live > 0 && (
                            <>
                                <span className="font-inter text-zinc-600 text-sm">·</span>
                                <span className="font-inter text-green-400 text-sm">
                                    {live} en vivo
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Progreso del torneo */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-inter text-xs text-zinc-500">
                        Progreso del torneo
                    </span>
                    <span className="font-inter text-xs text-zinc-400">
                        {finished} / {matches.length} partidos
                    </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div
                        className="bg-white rounded-full h-1.5 transition-all"
                        style={{ width: `${(finished / matches.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Partidos por fase */}
            {STAGE_ORDER.map((stage) => {
                const stageMatches = matchesByStage[stage]
                if (!stageMatches?.length) return null

                const stageFinished = stageMatches.filter(
                    (m) => m.status === "FINISHED"
                ).length

                return (
                    <div key={stage} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bebas text-xl text-zinc-400 tracking-wide">
                                {STAGE_LABELS[stage]}
                            </h2>
                            <span className="font-inter text-xs text-zinc-600">
                                {stageFinished}/{stageMatches.length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {stageMatches.map((match) => {
                                const homeName =
                                    match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"
                                const awayName =
                                    match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"

                                return (
                                    <div
                                        key={match.id}
                                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 flex items-center justify-between gap-4"
                                    >
                                        {/* Número + partido */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <span className="font-inter text-xs text-zinc-600 w-6 shrink-0">
                                                {match.matchNumber}
                                            </span>

                                            {match.group && (
                                                <span className="font-inter text-xs text-zinc-600 w-14 shrink-0">
                                                    Grupo {match.group}
                                                </span>
                                            )}

                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-inter font-medium text-white text-sm truncate">
                                                    {homeName}
                                                </span>

                                                {match.status === "FINISHED" ? (
                                                    <span className="font-bebas text-lg text-white shrink-0">
                                                        {match.homeScore} - {match.awayScore}
                                                    </span>
                                                ) : (
                                                    <span className="font-inter text-xs text-zinc-600 shrink-0">
                                                        vs
                                                    </span>
                                                )}

                                                <span className="font-inter font-medium text-white text-sm truncate">
                                                    {awayName}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Meta + acciones */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-inter text-xs text-zinc-600 hidden md:block">
                                                {formatDate(match.matchDate)}
                                            </span>

                                            <span className="font-inter text-xs text-zinc-600 hidden md:block">
                                                {match._count.predictions} pronósticos
                                            </span>

                                            <span
                                                className={`text-xs font-inter px-2 py-0.5 rounded-full ${STATUS_STYLES[match.status]}`}
                                            >
                                                {STATUS_LABELS[match.status]}
                                            </span>

                                            <MatchActions match={match} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}