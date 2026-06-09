"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPrivateLeague } from "@/actions/leagues"

export default function CreatePrivateLeagueModal({ onClose }) {
    const router = useRouter()
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [created, setCreated] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)
        setError(null)

        const result = await createPrivateLeague(name.trim())

        if (result?.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        setCreated(result)
        setLoading(false)
    }

    function handleGoToLeague() {
        router.push(`/leagues/${created.leagueId}`)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">

                {!created ? (
                    <>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="font-bebas text-2xl text-white tracking-wide">
                                    NUEVA LIGA
                                </h2>
                                <p className="font-inter text-zinc-400 text-sm mt-1">
                                    Se genera un código único para invitar amigos
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
                                    Nombre de la liga
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Los pibes del trabajo"
                                    maxLength={40}
                                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white font-inter text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>

                            {error && (
                                <p className="font-inter text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Creando..." : "Crear liga"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center text-2xl">
                                🎉
                            </div>
                            <div>
                                <h2 className="font-bebas text-2xl text-white tracking-wide">
                                    LIGA CREADA
                                </h2>
                                <p className="font-inter text-zinc-400 text-sm mt-1">
                                    Compartí este código con tus amigos
                                </p>
                            </div>

                            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-4 w-full">
                                <p className="font-inter text-xs text-zinc-500 mb-1">
                                    Código de invitación
                                </p>
                                <p className="font-bebas text-4xl text-white tracking-[0.2em]">
                                    {created.code}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleGoToLeague}
                                className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer"
                            >
                                Ir a mi liga
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full text-zinc-400 hover:text-white font-inter text-sm py-2 transition-colors cursor-pointer"
                            >
                                Cerrar
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}