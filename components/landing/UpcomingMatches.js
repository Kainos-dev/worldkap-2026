import Link from "next/link"

const STAGE_LABELS = {
    GROUP: "Fase de grupos",
    ROUND_OF_32: "Ronda de 32",
    ROUND_OF_16: "Octavos",
    QUARTER_FINAL: "Cuartos",
    SEMI_FINAL: "Semifinal",
    THIRD_PLACE: "Tercer puesto",
    FINAL: "Final",
}

const KNOCKOUT_STAGES = ["ROUND_OF_32", "ROUND_OF_16", "QUARTER_FINAL", "SEMI_FINAL", "THIRD_PLACE", "FINAL"]

function formatMatchDate(date) {
    return new Date(date).toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    })
}

function MatchRow({ match }) {
    const isKnockout = KNOCKOUT_STAGES.includes(match.stage)
    const homeTeamName = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"
    const awayTeamName = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"
    const isHomeKnown = !!match.homeTeam
    const isAwayKnown = !!match.awayTeam

    return (
        <div className="bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 rounded-xl px-4 py-4 sm:px-6 transition-colors duration-200 font-sans">

            {/* Fila principal: equipos + VS */}
            <div className="flex items-center gap-3 sm:gap-4">

                {/* Badge de grupo/etapa */}
                <div className="shrink-0 w-9 sm:w-10 text-center">
                    {match.group ? (
                        <span className="font-heading text-base text-zinc-500 leading-none">
                            G{match.group}
                        </span>
                    ) : isKnockout ? (
                        <span
                            className="text-[9px] font-medium tracking-wide uppercase leading-tight block text-center"
                            style={{ color: "#fe3d12" }}
                        >
                            {STAGE_LABELS[match.stage]?.split(" ")[0] ?? "—"}
                        </span>
                    ) : null}
                </div>

                {/* Equipo local */}
                <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    {match.homeTeam?.flagUrl && (
                        <img
                            src={match.homeTeam.flagUrl}
                            alt=""
                            aria-hidden="true"
                            className="w-5 h-[14px] object-cover rounded-[2px] shrink-0"
                        />
                    )}
                    <span
                        className={`text-sm font-medium truncate ${isHomeKnown ? "text-white" : "text-zinc-600 italic"
                            }`}
                    >
                        {homeTeamName}
                    </span>
                </div>

                {/* VS separator */}
                <div className="shrink-0 flex flex-col items-center gap-0.5">
                    <span className="font-heading text-sm text-zinc-700 leading-none">VS</span>
                </div>

                {/* Equipo visitante */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {match.awayTeam?.flagUrl && (
                        <img
                            src={match.awayTeam.flagUrl}
                            alt=""
                            aria-hidden="true"
                            className="w-5 h-[14px] object-cover rounded-[2px] shrink-0"
                        />
                    )}
                    <span
                        className={`text-sm font-medium truncate ${isAwayKnown ? "text-white" : "text-zinc-600 italic"
                            }`}
                    >
                        {awayTeamName}
                    </span>
                </div>

                {/* Fecha — visible en sm+ en la misma fila */}
                <div className="hidden sm:block text-right shrink-0 ml-2">
                    <time
                        dateTime={match.matchDate}
                        className="text-xs text-zinc-500"
                    >
                        {formatMatchDate(match.matchDate)}
                    </time>
                </div>

            </div>

            {/* Fecha en mobile — segunda línea */}
            <div className="sm:hidden mt-2.5 pl-9 flex items-center gap-2">
                <div className="w-3 h-px bg-zinc-800" aria-hidden="true" />
                <time
                    dateTime={match.matchDate}
                    className="text-xs text-zinc-600"
                >
                    {formatMatchDate(match.matchDate)}
                </time>
            </div>

        </div>
    )
}

export default function UpcomingMatches({ matches }) {
    return (
        <section className="bg-zinc-950 py-24 px-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div className="flex items-end justify-between gap-4 font-sans">
                    <div>
                        <span className=" text-xs tracking-[0.25em] text-zinc-600 uppercase block mb-3">
                            Próximamente
                        </span>
                        <h2 className="font-heading text-5xl text-white tracking-wide leading-none">
                            PRÓXIMOS PARTIDOS
                        </h2>
                        <p className="text-zinc-600 text-xs mt-2">
                            Horarios en tiempo argentino (UTC−3)
                        </p>
                    </div>
                    <Link
                        href="/leagues"
                        className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors duration-200 shrink-0 pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                    >
                        Ver todos
                        <span aria-hidden="true" className="text-base leading-none">→</span>
                    </Link>
                </div>

                {/* Lista de partidos */}
                {matches.length === 0 ? (
                    <div className="borderborder-zinc-900 rounded-xl py-16 flex flex-col items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-800"
                            aria-hidden="true"
                        >
                            <span className="text-zinc-600 text-lg leading-none">⚽</span>
                        </div>
                        <p className=" text-zinc-600 text-sm">
                            No hay partidos programados todavía.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2.5">
                        {matches.map((match) => (
                            <MatchRow key={match.id} match={match} />
                        ))}
                    </div>
                )}

                {/* Link mobile */}
                <Link
                    href="/leagues"
                    className="sm:hidden text-sm text-zinc-500 hover:text-white transition-colors duration-200 text-center py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                >
                    Ver todos los partidos →
                </Link>

            </div>
        </section>
    )
}