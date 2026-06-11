"use client"

import PredictionInput from "./PredictionInput"

function formatDate(date) {
    return new Date(date).toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    })
}

// Puntos dentro de la paleta del sistema
// 3 pts = rojo (máximo logro, color de marca)
// 1 pt  = zinc-400 (acertaste ganador, correcto pero no perfecto)
// 0 pts = zinc-700 (sin puntos, apagado)
const POINTS_STYLE = {
    3: { color: "#fe3d12", label: "+3" },
    1: { color: "#a1a1aa", label: "+1" },
    0: { color: "#3f3f46", label: "+0" },
}

export default function MatchCard({ match, prediction }) {
    const isOpen =
        match.status === "SCHEDULED" &&
        new Date(match.predictionsDeadline) > new Date()
    const isFinished = match.status === "FINISHED"
    const isLive = match.status === "LIVE"

    const homeName = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"
    const awayName = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"
    const isHomeKnown = !!match.homeTeam
    const isAwayKnown = !!match.awayTeam

    const pointsConfig = isFinished && prediction
        ? (POINTS_STYLE[prediction.points] ?? POINTS_STYLE[0])
        : null

    return (
        <article
            className={`
                bg-zinc-900 border rounded-xl flex flex-col transition-colors duration-200
                ${isFinished ? "border-zinc-800/40" : "border-zinc-800"}
            `}
        >
            {/* ── Franja superior: meta-info ─────────────────────────── */}
            <div className="flex items-center justify-between px-4 pt-3 pb-0 gap-3">

                <div className="flex items-center gap-2">
                    {/* Grupo */}
                    {match.group && (
                        <span className="font-sans text-[10px] font-medium text-zinc-600
                                         bg-zinc-800/80 px-2 py-0.5 rounded-md tracking-wide uppercase">
                            Grupo {match.group}
                        </span>
                    )}

                    {/* Estado */}
                    {isLive && (
                        <span className="flex items-center gap-1.5 font-sans text-[10px] font-medium text-emerald-400">
                            <span
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"
                                aria-hidden="true"
                            />
                            En vivo
                        </span>
                    )}

                    {isFinished && (
                        <span className="font-sans text-[10px] text-zinc-700 uppercase tracking-wide">
                            Finalizado
                        </span>
                    )}
                </div>

                {/* Fecha */}
                <time
                    suppressHydrationWarning
                    dateTime={match.matchDate}
                    className="font-sans text-[10px] text-zinc-600"
                >
                    {formatDate(match.matchDate)}
                </time>
            </div>

            {/* ── Cuerpo: equipos + marcador ─────────────────────────── */}
            <div className="flex items-center gap-3 px-4 py-4">

                {/* Equipo local */}
                <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    <span className={`font-sans font-medium text-sm text-right truncate
                                      ${isHomeKnown ? "text-white" : "text-zinc-600 italic"}`}>
                        {homeName}
                    </span>
                    {match.homeTeam?.flagUrl && (
                        <img
                            src={match.homeTeam.flagUrl}
                            alt=""
                            aria-hidden="true"
                            className="w-6 h-[17px] object-cover rounded-[2px] shrink-0"
                        />
                    )}
                </div>

                {/* Marcador central */}
                <div className="shrink-0 flex items-center justify-center min-w-[64px]">
                    {isFinished ? (
                        <div className="flex items-center gap-1">
                            <span className="font-heading text-2xl text-white leading-none">
                                {match.homeScore}
                            </span>
                            <span className="font-heading text-xl text-zinc-700 leading-none mx-0.5">
                                –
                            </span>
                            <span className="font-heading text-2xl text-white leading-none">
                                {match.awayScore}
                            </span>
                        </div>
                    ) : (
                        <span className="font-sans text-xs text-zinc-700 uppercase tracking-widest">
                            vs
                        </span>
                    )}
                </div>

                {/* Equipo visitante */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {match.awayTeam?.flagUrl && (
                        <img
                            src={match.awayTeam.flagUrl}
                            alt=""
                            aria-hidden="true"
                            className="w-6 h-[17px] object-cover rounded-[2px] shrink-0"
                        />
                    )}
                    <span className={`font-sans font-medium text-sm truncate
                                      ${isAwayKnown ? "text-white" : "text-zinc-600 italic"}`}>
                        {awayName}
                    </span>
                </div>

            </div>

            {/* ── Franja de predicción ───────────────────────────────── */}
            <div className="border-t border-zinc-800/60 px-4 py-3">

                {/* Partido abierto: input */}
                {isOpen && (
                    <PredictionInput
                        matchId={match.id}
                        existing={prediction}
                        homeName={homeName}
                        awayName={awayName}
                    />
                )}

                {/* Partido cerrado con predicción */}
                {!isOpen && prediction && (
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-sans text-xs text-zinc-600">
                            Tu predicción
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="font-heading text-xl text-zinc-400 leading-none">
                                {prediction.homeGoals}
                                <span className="text-zinc-700 mx-1">–</span>
                                {prediction.awayGoals}
                            </span>

                            {/* Puntos ganados */}
                            {isFinished && pointsConfig && (
                                <span
                                    className="font-heading text-xl leading-none"
                                    style={{ color: pointsConfig.color }}
                                    aria-label={`${pointsConfig.label} puntos`}
                                >
                                    {pointsConfig.label}
                                    <span className="font-sans text-[10px] ml-0.5"
                                        style={{ color: pointsConfig.color, opacity: 0.7 }}>
                                        pts
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Partido cerrado sin predicción, no finalizado */}
                {!isOpen && !prediction && !isFinished && (
                    <p className="font-sans text-xs text-zinc-700 text-center py-0.5">
                        El plazo para predecir cerró
                    </p>
                )}

                {/* Partido finalizado sin predicción */}
                {!isOpen && !prediction && isFinished && (
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-sans text-xs text-zinc-700">
                            Sin predicción
                        </span>
                        <span className="font-heading text-xl text-zinc-800 leading-none">
                            +0
                            <span className="font-sans text-[10px] ml-0.5 text-zinc-800">pts</span>
                        </span>
                    </div>
                )}

            </div>

        </article>
    )
}