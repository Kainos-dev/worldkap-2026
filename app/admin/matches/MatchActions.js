"use client"

import { useState } from "react"
import { updateMatchResult, updateMatchStatus, deleteMatch } from "@/actions/matches"

export default function MatchActions({ match }) {
    const [showResultForm, setShowResultForm] = useState(false)
    const [homeScore, setHomeScore] = useState("")
    const [awayScore, setAwayScore] = useState("")
    const [loading, setLoading] = useState(false)

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
        if (!confirm(`¿Eliminár ${match.homeTeam} vs ${match.awayTeam}?`)) return
        setLoading(true)
        await deleteMatch(match.id)
        setLoading(false)
    }

    return (
        <div className="flex items-center gap-2">

            {/* Cargar resultado */}
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
                                className="w-10 bg-zinc-800 border border-zinc-700 rounded text-white text-center text-sm py-1 font-inter"
                            />
                            <span className="text-zinc-500 text-sm">-</span>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={awayScore}
                                onChange={(e) => setAwayScore(e.target.value)}
                                placeholder="V"
                                className="w-10 bg-zinc-800 border border-zinc-700 rounded text-white text-center text-sm py-1 font-inter"
                            />
                            <button
                                onClick={handleResult}
                                disabled={loading}
                                className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded font-inter cursor-pointer"
                            >
                                OK
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
                            Cargar resultado
                        </button>
                    )}
                </>
            )}

            {/* Marcar en vivo */}
            {match.status === "SCHEDULED" && (
                <button
                    onClick={() => handleStatus("LIVE")}
                    disabled={loading}
                    className="text-xs text-green-400 hover:text-green-300 border border-green-800 hover:border-green-600 px-2 py-1 rounded font-inter transition-colors cursor-pointer"
                >
                    En vivo
                </button>
            )}

            {/* Eliminar */}
            <button
                onClick={handleDelete}
                disabled={loading}
                className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-2 py-1 rounded font-inter transition-colors cursor-pointer"
            >
                Eliminar
            </button>

        </div>
    )
}