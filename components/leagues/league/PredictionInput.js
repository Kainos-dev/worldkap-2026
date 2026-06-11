"use client"

import { useState } from "react"
import { savePrediction } from "@/actions/predictions"

export default function PredictionInput({ matchId, existing, homeName, awayName }) {
    const [home, setHome] = useState(existing?.homeGoals?.toString() ?? "")
    const [away, setAway] = useState(existing?.awayGoals?.toString() ?? "")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState(null)

    const hasChanged =
        home !== (existing?.homeGoals?.toString() ?? "") ||
        away !== (existing?.awayGoals?.toString() ?? "")

    const canSave = home !== "" && away !== "" && (hasChanged || !existing)

    async function handleSave() {
        if (!canSave) return
        setLoading(true)
        setError(null)
        setSaved(false)

        const result = await savePrediction(matchId, home, away)

        if (result?.error) {
            setError(result.error)
        } else {
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        }

        setLoading(false)
    }

    function handleInput(setter) {
        return (e) => {
            // Solo dígitos, sin negativos, sin decimales
            const val = e.target.value.replace(/[^0-9]/g, "")
            if (val === "" || (parseInt(val, 10) >= 0 && parseInt(val, 10) <= 20)) {
                setter(val)
                if (saved) setSaved(false)
                if (error) setError(null)
            }
        }
    }

    return (
        <div className="flex items-center justify-between gap-3">

            {/* Label izquierdo */}
            <span className="font-sans text-xs text-zinc-600 shrink-0">
                {existing ? "Tu predicción" : "Predecí"}
            </span>

            {/* Inputs + botón */}
            <div className="flex items-center gap-2.5">

                {/* Input local */}
                <div className="flex flex-col items-center gap-1">
                    <label
                        htmlFor={`pred-home-${matchId}`}
                        className="font-sans text-[9px] text-zinc-700 uppercase tracking-wide sr-only sm:not-sr-only"
                    >
                        {homeName ?? "Local"}
                    </label>
                    <input
                        id={`pred-home-${matchId}`}
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="20"
                        value={home}
                        onChange={handleInput(setHome)}
                        placeholder="–"
                        aria-label={`Goles de ${homeName ?? "equipo local"}`}
                        className="
                            w-11 h-10 bg-zinc-800 border border-zinc-700 rounded-lg
                            text-white text-center font-heading text-2xl leading-none
                            placeholder:text-zinc-700 placeholder:font-sans placeholder:text-sm
                            transition-colors duration-150
                            hover:border-zinc-600
                            focus:outline-none focus:border-zinc-500
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                        "
                    />
                </div>

                {/* Separador */}
                <span className="font-heading text-xl text-zinc-700 leading-none select-none" aria-hidden="true">
                    –
                </span>

                {/* Input visitante */}
                <div className="flex flex-col items-center gap-1">
                    <label
                        htmlFor={`pred-away-${matchId}`}
                        className="font-sans text-[9px] text-zinc-700 uppercase tracking-wide sr-only sm:not-sr-only"
                    >
                        {awayName ?? "Visitante"}
                    </label>
                    <input
                        id={`pred-away-${matchId}`}
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="20"
                        value={away}
                        onChange={handleInput(setAway)}
                        placeholder="–"
                        aria-label={`Goles de ${awayName ?? "equipo visitante"}`}
                        className="
                            w-11 h-10 bg-zinc-800 border border-zinc-700 rounded-lg
                            text-white text-center font-heading text-2xl leading-none
                            placeholder:text-zinc-700 placeholder:font-sans placeholder:text-sm
                            transition-colors duration-150
                            hover:border-zinc-600
                            focus:outline-none focus:border-zinc-500
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                        "
                    />
                </div>

                {/* Botón guardar */}
                <button
                    onClick={handleSave}
                    disabled={loading || !canSave}
                    aria-label={
                        saved ? "Predicción guardada" :
                            loading ? "Guardando predicción" :
                                existing ? "Actualizar predicción" :
                                    "Guardar predicción"
                    }
                    className="
                        font-sans text-xs px-3 h-10 rounded-lg
                        transition-all duration-200 cursor-pointer shrink-0
                        disabled:opacity-30 disabled:cursor-not-allowed
                        focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-white
                        border
                    "
                    style={
                        saved
                            ? { background: "#fe3d1215", color: "#fe3d12", borderColor: "#fe3d1230" }
                            : { background: "transparent", color: "#a1a1aa", borderColor: "#3f3f46" }
                    }
                    onMouseEnter={e => {
                        if (!e.currentTarget.disabled && !saved)
                            e.currentTarget.style.cssText = `
                                background: #27272a;
                                color: #ffffff;
                                border-color: #52525b;
                                cursor: pointer;
                            `
                    }}
                    onMouseLeave={e => {
                        if (!saved)
                            e.currentTarget.style.cssText = `
                                background: transparent;
                                color: #a1a1aa;
                                border-color: #3f3f46;
                            `
                    }}
                >
                    {loading ? "..." : saved ? "✓ Listo" : existing ? "Actualizar" : "Guardar"}
                </button>

            </div>

            {/* Error inline */}
            {error && (
                <span
                    role="alert"
                    className="font-sans text-[10px] text-red-400 shrink-0"
                >
                    {error}
                </span>
            )}

        </div>
    )
}