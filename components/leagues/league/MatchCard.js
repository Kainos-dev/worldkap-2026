"use client"

import { useEffect, useState } from "react"

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

const STATUS_CONFIG = {
    SCHEDULED: { label: "Programado", style: "text-zinc-500" },
    LIVE: { label: "En vivo", style: "text-green-400" },
    FINISHED: { label: "Finalizado", style: "text-zinc-600" },
}

export default function MatchCard({ match, prediction }) {
    const isOpen =
        match.status === "SCHEDULED" &&
        new Date(match.predictionsDeadline) > new Date()
    const isFinished = match.status === "FINISHED"
    const statusConfig = STATUS_CONFIG[match.status]

    const homeName = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD"
    const awayName = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD"

    return (
        <div className={`
      bg-zinc-900 border rounded-2xl p-4 flex flex-col gap-4 transition-colors
      ${isFinished ? "border-zinc-800/50 opacity-75" : "border-zinc-800"}
    `}>

            {/* Top row: grupo + estado + fecha */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {match.group && (
                        <span className="font-inter text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-md">
                            Grupo {match.group}
                        </span>
                    )}
                    <span className={`font-inter text-xs ${statusConfig.style}`}>
                        {statusConfig.label}
                        {match.status === "LIVE" && (
                            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full ml-1.5 animate-pulse" />
                        )}
                    </span>
                </div>
                <span
                    suppressHydrationWarning
                    className="font-inter text-xs text-zinc-500"
                >
                    {formatDate(match.matchDate)}
                </span>
            </div>

            {/* Equipos y resultado/predicción */}
            <div className="flex items-center gap-4">

                {/* Local */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="font-inter font-medium text-white text-sm text-right">
                        {homeName}
                    </span>
                    {match.homeTeam?.flagUrl && (
                        <img
                            src={match.homeTeam.flagUrl}
                            alt={homeName}
                            className="w-6 h-4 object-cover rounded-sm shrink-0"
                        />
                    )}
                </div>

                {/* Marcador o VS */}
                <div className="flex items-center gap-2 shrink-0">
                    {isFinished ? (
                        <span className="font-bebas text-2xl text-white tracking-wider">
                            {match.homeScore} - {match.awayScore}
                        </span>
                    ) : (
                        <span className="font-inter text-zinc-600 text-sm">vs</span>
                    )}
                </div>

                {/* Visitante */}
                <div className="flex items-center gap-2 flex-1">
                    {match.awayTeam?.flagUrl && (
                        <img
                            src={match.awayTeam.flagUrl}
                            alt={awayName}
                            className="w-6 h-4 object-cover rounded-sm shrink-0"
                        />
                    )}
                    <span className="font-inter font-medium text-white text-sm">
                        {awayName}
                    </span>
                </div>

            </div>

            {/* Predicción */}
            <div className="border-t border-zinc-800 pt-3">
                {isOpen && (
                    <PredictionInput
                        matchId={match.id}
                        existing={prediction}
                    />
                )}

                {!isOpen && prediction && (
                    <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-zinc-500">
                            Tu predicción
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="font-bebas text-lg text-zinc-300">
                                {prediction.homeGoals} - {prediction.awayGoals}
                            </span>
                            {isFinished && (
                                <span className={`
                  font-bebas text-lg
                  ${prediction.points === 3 ? "text-yellow-400" :
                                        prediction.points === 1 ? "text-blue-400" :
                                            "text-zinc-600"}
                `}>
                                    +{prediction.points} pts
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {!isOpen && !prediction && !isFinished && (
                    <p className="font-inter text-xs text-zinc-600 text-center">
                        No ingresaste predicción para este partido
                    </p>
                )}

                {!isOpen && !prediction && isFinished && (
                    <p className="font-inter text-xs text-zinc-600 text-center">
                        Sin predicción · 0 pts
                    </p>
                )}
            </div>

        </div>
    )
}