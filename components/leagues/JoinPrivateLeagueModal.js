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

    function handleCodeChange(e) {
        // Solo letras y números, uppercase, max 10
        const value = e.target.value.replace(/[^A-Z0-9]/gi, "").toUpperCase()
        setCode(value)
        if (error) setError(null)
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-league-title"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md flex flex-col gap-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2
                            id="join-league-title"
                            className="font-heading text-2xl text-white tracking-wide leading-none"
                        >
                            UNIRME A UNA LIGA
                        </h2>
                        <p className="font-sans text-zinc-500 text-sm">
                            Ingresá el código que te compartieron
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="text-zinc-600 hover:text-white transition-colors duration-150 cursor-pointer
                                   w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                   shrink-0 -mr-1 -mt-0.5"
                    >
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="league-code"
                            className="font-sans text-sm text-zinc-400"
                        >
                            Código de invitación
                        </label>

                        {/* Input de código — display especial */}
                        <div className="relative">
                            <input
                                id="league-code"
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="AB12CD34"
                                maxLength={10}
                                autoFocus
                                autoCapitalize="characters"
                                autoCorrect="off"
                                spellCheck="false"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl
                                           px-4 py-4
                                           text-white font-heading text-3xl tracking-[0.3em]
                                           placeholder:text-zinc-700 placeholder:font-sans
                                           placeholder:text-base placeholder:tracking-normal
                                           text-center
                                           transition-colors duration-150
                                           focus:outline-none focus:border-zinc-500
                                           hover:border-zinc-600"
                                aria-describedby={error ? "join-error" : undefined}
                            />
                        </div>

                        <p className="font-sans text-xs text-zinc-700 text-center">
                            Solo letras y números · Sin espacios
                        </p>
                    </div>

                    {error && (
                        <p
                            id="join-error"
                            role="alert"
                            className="font-sans text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-xl"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !code.trim()}
                        className="w-full font-sans font-semibold text-sm py-3 rounded-xl
                                   transition-all duration-200 cursor-pointer
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   focus-visible:outline focus-visible:outline-2
                                   focus-visible:outline-offset-2 focus-visible:outline-[#fe3d12]"
                        style={{ background: "#fe3d12", color: "#ffffff" }}
                        onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#e03510" }}
                        onMouseLeave={e => e.currentTarget.style.background = "#fe3d12"}
                    >
                        {loading ? "Buscando liga..." : "Unirme"}
                    </button>
                </form>

            </div>
        </div>
    )
}