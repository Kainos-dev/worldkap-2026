import { prisma } from "@/lib/prisma"
import Link from "next/link"
import MatchActions from "./MatchActions"

const STAGE_LABELS = {
    GROUP: "Fase de grupos",
    ROUND_OF_16: "Octavos",
    QUARTER_FINAL: "Cuartos",
    SEMI_FINAL: "Semifinal",
    THIRD_PLACE: "Tercer puesto",
    FINAL: "Final",
}

const STATUS_STYLES = {
    SCHEDULED: "bg-zinc-700 text-zinc-300",
    LIVE: "bg-green-500/20 text-green-400",
    FINISHED: "bg-zinc-800 text-zinc-500",
}

export default async function AdminMatchesPage() {
    const matches = await prisma.match.findMany({
        orderBy: { matchDate: "asc" },
    })

    // Agrupar por fase
    const matchesByStage = matches.reduce((acc, match) => {
        if (!acc[match.stage]) acc[match.stage] = []
        acc[match.stage].push(match)
        return acc
    }, {})

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        PARTIDOS
                    </h1>
                    <p className="font-inter text-zinc-400 text-sm mt-1">
                        {matches.length} partidos cargados
                    </p>
                </div>
                <Link
                    href="/admin/matches/new"
                    className="bg-white text-zinc-900 font-inter font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                    + Nuevo partido
                </Link>
            </div>

            {matches.length === 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                    <p className="font-inter text-zinc-400">
                        No hay partidos cargados todavía.
                    </p>
                </div>
            )}

            {Object.entries(matchesByStage).map(([stage, stageMatches]) => (
                <div key={stage} className="flex flex-col gap-3">
                    <h2 className="font-bebas text-xl text-zinc-400 tracking-wide">
                        {STAGE_LABELS[stage]}
                    </h2>

                    <div className="flex flex-col gap-2">
                        {stageMatches.map((match) => (
                            <div
                                key={match.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between"
                            >
                                {/* Partido */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        {match.group && (
                                            <span className="font-inter text-xs text-zinc-500 w-12">
                                                Grupo {match.group}
                                            </span>
                                        )}
                                        <span className="font-inter font-medium text-white text-sm">
                                            {match.homeTeam}
                                        </span>
                                        {match.status === "FINISHED" ? (
                                            <span className="font-bebas text-lg text-white">
                                                {match.homeScore} - {match.awayScore}
                                            </span>
                                        ) : (
                                            <span className="font-inter text-xs text-zinc-500">vs</span>
                                        )}
                                        <span className="font-inter font-medium text-white text-sm">
                                            {match.awayTeam}
                                        </span>
                                    </div>
                                </div>

                                {/* Info + acciones */}
                                <div className="flex items-center gap-4">
                                    <span className="font-inter text-xs text-zinc-500">
                                        {new Date(match.matchDate).toLocaleDateString("es-AR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span className={`text-xs font-inter px-2 py-0.5 rounded-full ${STATUS_STYLES[match.status]}`}>
                                        {match.status === "SCHEDULED" ? "Programado" :
                                            match.status === "LIVE" ? "En vivo" : "Finalizado"}
                                    </span>
                                    <MatchActions match={match} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}