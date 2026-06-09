"use client"

import { useState } from "react"
import { savePrediction } from "@/actions/predictions"

export default function PredictionInput({ matchId, existing }) {
    const [home, setHome] = useState(existing?.homeGoals?.toString() ?? "")
    const [away, setAway] = useState(existing?.awayGoals?.toString() ?? "")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState(null)

    const hasChanged =
        home !== (existing?.homeGoals?.toString() ?? "") ||
        away !== (existing?.awayGoals?.toString() ?? "")

    async function handleSave() {
        if (home === "" || away === "") return
        setLoading(true)
        setError(null)
        setSaved(false)

        const result = await savePrediction(matchId, home, away)

        if (result?.error) {
            setError(result.error)
        } else {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        }

        setLoading(false)
    }

    return (
        <div className="flex items-center justify-between gap-4">
            <span className="font-inter text-xs text-zinc-500">
                {existing ? "Tu predicción" : "Predecí"}
            </span>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        max="20"
                        value={home}
                        onChange={(e) => setHome(e.target.value)}
                        className="w-10 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center font-bebas text-xl py-1 focus:outline-none focus:border-zinc-500"
                    />
                    <span className="text-zinc-600 font-bebas text-lg">-</span>
                    <input
                        type="number"
                        min="0"
                        max="20"
                        value={away}
                        onChange={(e) => setAway(e.target.value)}
                        className="w-10 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center font-bebas text-xl py-1 focus:outline-none focus:border-zinc-500"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading || home === "" || away === "" || (!hasChanged && !!existing)}
                    className={`
            font-inter text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer
            ${saved
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 disabled:opacity-40"
                        }
          `}
                >
                    {loading ? "..." : saved ? "✓ Guardado" : existing ? "Actualizar" : "Guardar"}
                </button>
            </div>

            {error && (
                <span className="font-inter text-xs text-red-400">{error}</span>
            )}
        </div>
    )
}