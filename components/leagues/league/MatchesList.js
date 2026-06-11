"use client"

import { useState, useMemo } from "react"
import MatchCard from "./MatchCard"

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

function getDefaultOpenStages(byStage) {
    // Abre automáticamente la primera fase que tenga partidos SCHEDULED o LIVE
    // Si no hay ninguna, abre la última fase con partidos
    const activeStage = STAGE_ORDER.find((stage) => {
        const matches = byStage[stage]
        if (!matches?.length) return false
        return matches.some((m) => m.status === "SCHEDULED" || m.status === "LIVE")
    })

    if (activeStage) return new Set([activeStage])

    // Fallback: abrir la última fase disponible
    const lastStage = [...STAGE_ORDER].reverse().find((s) => byStage[s]?.length)
    return lastStage ? new Set([lastStage]) : new Set()
}

function StageHeader({ stage, matches, predictions, isOpen, onToggle }) {
    const total = matches.length
    const predicted = matches.filter((m) => predictions[m.id]).length
    const hasActive = matches.some((m) => m.status === "SCHEDULED" || m.status === "LIVE")
    const allFinished = matches.every((m) => m.status === "FINISHED")

    return (
        <button
            onClick={onToggle}
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between gap-4 py-3 group
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-white rounded-sm cursor-pointer"
        >
            <div className="flex items-center gap-3">
                {/* Indicador de estado de fase */}
                <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200"
                    aria-hidden="true"
                    style={{
                        background: hasActive
                            ? "#fe3d12"
                            : allFinished
                                ? "#3f3f46"
                                : "#52525b",
                    }}
                />

                <h2 className="font-heading text-base text-zinc-400 group-hover:text-zinc-200
                               tracking-[0.15em] uppercase transition-colors duration-150">
                    {STAGE_LABELS[stage]}
                </h2>

                {/* Progreso de predicciones */}
                <span className="font-sans text-xs text-zinc-700 hidden sm:block">
                    {predicted}/{total}
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* Barra de progreso */}
                {total > 0 && (
                    <div
                        className="hidden sm:block w-16 h-0.5 bg-zinc-800 rounded-full overflow-hidden"
                        aria-hidden="true"
                    >
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${(predicted / total) * 100}%`,
                                background: predicted === total ? "#fe3d12" : "#52525b",
                            }}
                        />
                    </div>
                )}

                {/* Chevron */}
                <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-zinc-600 group-hover:text-zinc-400 transition-all duration-200 shrink-0"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                    <path
                        d="M2.5 5L7 9.5L11.5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </button>
    )
}

export default function MatchesList({ matches, predictions }) {
    const byStage = useMemo(() => {
        return matches.reduce((acc, match) => {
            if (!acc[match.stage]) acc[match.stage] = []
            acc[match.stage].push(match)
            return acc
        }, {})
    }, [matches])

    const [openStages, setOpenStages] = useState(() => getDefaultOpenStages(byStage))

    function toggleStage(stage) {
        setOpenStages((prev) => {
            const next = new Set(prev)
            if (next.has(stage)) {
                next.delete(stage)
            } else {
                next.add(stage)
            }
            return next
        })
    }

    const availableStages = STAGE_ORDER.filter((s) => byStage[s]?.length)

    if (availableStages.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-16">
                <p className="font-sans text-zinc-600 text-sm">
                    No hay partidos disponibles todavía.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {availableStages.map((stage, index) => {
                const stageMatches = byStage[stage]
                const isOpen = openStages.has(stage)
                const isLast = index === availableStages.length - 1

                return (
                    <div key={stage}>
                        {/* Divisor superior (excepto el primero) */}
                        {index > 0 && (
                            <div className="h-px bg-zinc-900" aria-hidden="true" />
                        )}

                        <div className="py-1">
                            <StageHeader
                                stage={stage}
                                matches={stageMatches}
                                predictions={predictions}
                                isOpen={isOpen}
                                onToggle={() => toggleStage(stage)}
                            />

                            {/* Cards — solo se renderizan si la fase está abierta */}
                            {isOpen && (
                                <div className="flex flex-col gap-2.5 pb-5">
                                    {stageMatches.map((match) => (
                                        <MatchCard
                                            key={match.id}
                                            match={match}
                                            prediction={predictions[match.id] ?? null}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}