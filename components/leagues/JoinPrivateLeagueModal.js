"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { joinPrivateLeague } from "@/actions/leagues"

export default function JoinPrivateLeagueModal({ onClose }) {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!code.trim()) return
        setLoading(true)
        setError(null)

        const result = await joinPrivateLeague(code.trim())

        if (result?.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        router.push(`/leagues/${result.leagueId}`)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">

                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="font-bebas text-2xl text-white tracking-wide">
                            UNIRME A UNA LIGA
                        </h2>
                        <p className="font-inter text-zinc-400 text-sm mt-1">
                            Ingresá el código que te compartieron
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-inter text-sm text-zinc-300">
                            Código de invitación
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Ej: AB12CD34"
                            maxLength={10}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bebas text-xl tracking-[0.2em] placeholder:text-zinc-600 placeholder:font-inter placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-zinc-500 text-center"
                        />
                    </div>

                    {error && (
                        <p className="font-inter text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !code.trim()}
                        className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Buscando..." : "Unirme"}
                    </button>
                </form>

            </div>
        </div>
    )
}