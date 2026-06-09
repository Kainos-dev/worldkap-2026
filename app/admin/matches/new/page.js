"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createMatch } from "@/actions/matches"

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

const STAGES = [
    { value: "GROUP", label: "Fase de grupos" },
    { value: "ROUND_OF_16", label: "Octavos de final" },
    { value: "QUARTER_FINAL", label: "Cuartos de final" },
    { value: "SEMI_FINAL", label: "Semifinal" },
    { value: "THIRD_PLACE", label: "Tercer puesto" },
    { value: "FINAL", label: "Final" },
]

// Todos los equipos del Mundial 2026
const TEAMS = [
    // CONMEBOL
    "Argentina", "Brasil", "Uruguay", "Colombia", "Ecuador",
    "Paraguay", "Chile", "Bolivia", "Venezuela", "Perú",
    // UEFA
    "España", "Francia", "Alemania", "Inglaterra", "Portugal",
    "Países Bajos", "Bélgica", "Italia", "Croacia", "Austria",
    "Suiza", "Dinamarca", "Serbia", "Escocia", "Turquía",
    "Hungría", "Eslovenia", "Rumania", "Rep. Checa", "Albania",
    "Ucrania", "Eslovaquia", "Georgia",
    // CONCACAF
    "Estados Unidos", "México", "Canadá", "Costa Rica",
    "Jamaica", "Honduras", "Panamá", "El Salvador",
    // CAF
    "Marruecos", "Senegal", "Egipto", "Nigeria", "Sudáfrica",
    "Costa de Marfil", "Ghana", "Camerún", "Mali", "Angola",
    "Argelia", "Mozambique",
    // AFC
    "Japón", "Corea del Sur", "Arabia Saudita", "Irán",
    "Australia", "Iraq", "Jordania", "Uzbekistán",
    // OFC
    "Nueva Zelanda",
    // Repechaje
    "Tahití",
].sort()

export default function NewMatchPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [stage, setStage] = useState("GROUP")

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.target)
        const result = await createMatch(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        router.push("/admin/matches")
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="font-bebas text-4xl text-white tracking-wide">
                    NUEVO PARTIDO
                </h1>
                <p className="font-inter text-zinc-400 text-sm mt-1">
                    Cargá los datos del partido
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Fase */}
                <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-sm text-zinc-300">Fase</label>
                    <select
                        name="stage"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-zinc-500"
                    >
                        {STAGES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Grupo (solo en fase de grupos) */}
                {stage === "GROUP" && (
                    <div className="flex flex-col gap-1.5">
                        <label className="font-inter text-sm text-zinc-300">Grupo</label>
                        <select
                            name="group"
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-zinc-500"
                        >
                            {GROUPS.map((g) => (
                                <option key={g} value={g}>Grupo {g}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Equipos */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-inter text-sm text-zinc-300">
                            Equipo local
                        </label>
                        <select
                            name="homeTeam"
                            required
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-zinc-500"
                        >
                            <option value="">Seleccioná un equipo</option>
                            {TEAMS.map((team) => (
                                <option key={team} value={team}>{team}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-inter text-sm text-zinc-300">
                            Equipo visitante
                        </label>
                        <select
                            name="awayTeam"
                            required
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-zinc-500"
                        >
                            <option value="">Seleccioná un equipo</option>
                            {TEAMS.map((team) => (
                                <option key={team} value={team}>{team}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fecha y hora */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-inter text-sm text-zinc-300">Fecha</label>
                        <input
                            type="date"
                            name="matchDate"
                            required
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-zinc-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-inter text-sm text-zinc-300">
                            Hora (Argentina)
                        </label>
                        <input
                            type="time"
                            name="matchTime"
                            required
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white font-inter text-sm focus:outline-none focus:border-zinc-500"
                        />
                    </div>
                </div>

                {error && (
                    <p className="font-inter text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
                        {error}
                    </p>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-zinc-900 font-inter font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Guardando..." : "Crear partido"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/matches")}
                        className="text-zinc-400 font-inter text-sm px-6 py-2.5 rounded-lg hover:text-white transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>

            </form>
        </div>
    )
}