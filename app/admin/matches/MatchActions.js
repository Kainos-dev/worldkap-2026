"use client"

import { useState } from "react"
import { updateMatchResult, updateMatchStatus, deleteMatch } from "@/actions/matches"

const STATUS_TRANSITIONS = {
    SCHEDULED: [
        { label: "En vivo", value: "LIVE", style: "text-green-400 border-green-800 hover:border-green-600" },
        { label: "Postergar", value: "POSTPONED", style: "text-yellow-400 border-yellow-800 hover:border-yellow-600" },
    ],
    LIVE: [
        { label: "Volver a programado", value: "SCHEDULED", style: "text-zinc-400 border-zinc-700 hover:border-zinc-500" },
        { label: "Postergar", value: "POSTPONED", style: "text-yellow-400 border-yellow-800 hover:border-yellow-600" },
    ],
    POSTPONED: [
        { label: "Reprogramar", value: "SCHEDULED", style: "text-zinc-400 border-zinc-700 hover:border-zinc-500" },
    ],
    FINISHED: [],
}

export default function MatchActions({ match }) {
    const [showResultForm, setShowResultForm] = useState(false)
    const [homeScore, setHomeScore] = useState(match.homeScore?.toString() ?? "")
    const [awayScore, setAwayScore] = useState(match.awayScore?.toString() ?? "")
    const [loading, setLoading] = useState(false)

    const homeName = match.homeTeam?.name ?? match.homePlaceholder ?? "Local"
    const awayName = match.awayTeam?.name ?? match.awayPlaceholder ?? "Visitante"
    const transitions = STATUS_TRANSITIONS[match.status] ?? []

    async function handleResult() {
        if (homeScore === "" || awayScore === "") return
        setLoading(true)
        await updateMatchResult(match.id, homeScore, awayScore)
        setShowResultForm(false)
        setLoading(false)
    }

    async function handleStatus(status) {
        setLoading(true)
        await updateMatchStatus(match.id, status)
        setLoading(false)
    }

    async function handleDelete() {
        if (!confirm(`¿Eliminar ${homeName} vs ${awayName}?`)) return
        setLoading(true)
        await deleteMatch(match.id)
        setLoading(false)
    }

    return (
        <div className="flex items-center gap-2 flex-wrap justify-end">

            {/* Formulario de resultado */}
            {match.status !== "FINISHED" && (
                <>
                    {showResultForm ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={homeScore}
                                onChange={(e) => setHomeScore(e.target.value)}
                                placeholder="L"
                                className="w-10 bg-zinc-800 border border-zinc-700 rounded text-white text-center py-1 font-bebas text-lg focus:outline-none focus:border-zinc-500"
                            />
                            <span className="text-zinc-500 text-sm">-</span>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={awayScore}
                                onChange={(e) => setAwayScore(e.target.value)}
                                placeholder="V"
                                className="w-10 bg-zinc-800 border border-zinc-700 rounded text-white text-center py-1 font-bebas text-lg focus:outline-none focus:border-zinc-500"
                            />
                            <button
                                onClick={handleResult}
                                disabled={loading}
                                className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1.5 rounded font-inter cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "..." : "OK"}
                            </button>
                            <button
                                onClick={() => setShowResultForm(false)}
                                className="text-xs text-zinc-500 hover:text-white px-2 py-1 font-inter cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowResultForm(true)}
                            className="text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2 py-1 rounded font-inter transition-colors cursor-pointer"
                        >
                            Resultado
                        </button>
                    )}
                </>
            )}

            {/* Editar resultado ya cargado */}
            {match.status === "FINISHED" && (
                <>
                    {showResultForm ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={homeScore}
                                onChange={(e) => setHomeScore(e.target.value)}
                                className="w-10 bg-zinc-800 border border-zinc-700 rounded text-white text-center py-1 font-bebas text-lg focus:outline-none"
                            />
                            <span className="text-zinc-500 text-sm">-</span>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={awayScore}
                                onChange={(e) => setAwayScore(e.target.value)}
                                className="w-10 bg-zinc-800 border border-zinc-700 rounded text-white text-center py-1 font-bebas text-lg focus:outline-none"
                            />
                            <button
                                onClick={handleResult}
                                disabled={loading}
                                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1.5 rounded font-inter cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "..." : "Corregir"}
                            </button>
                            <button
                                onClick={() => setShowResultForm(false)}
                                className="text-xs text-zinc-500 hover:text-white px-2 py-1 font-inter cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowResultForm(true)}
                            className="text-xs text-zinc-600 hover:text-zinc-400 border border-zinc-800 hover:border-zinc-700 px-2 py-1 rounded font-inter transition-colors cursor-pointer"
                        >
                            Editar
                        </button>
                    )}
                </>
            )}

            {/* Transiciones de estado dinámicas */}
            {!showResultForm && transitions.map((t) => (
                <button
                    key={t.value}
                    onClick={() => handleStatus(t.value)}
                    disabled={loading}
                    className={`text-xs border px-2 py-1 rounded font-inter transition-colors cursor-pointer disabled:opacity-50 ${t.style}`}
                >
                    {t.label}
                </button>
            ))}

            {/* Eliminar solo si no tiene predicciones */}
            {match._count?.predictions === 0 && !showResultForm && (
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-2 py-1 rounded font-inter transition-colors cursor-pointer disabled:opacity-50"
                >
                    Eliminar
                </button>
            )}

        </div>
    )
}