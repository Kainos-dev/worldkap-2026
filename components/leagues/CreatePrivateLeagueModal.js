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
    const [copied, setCopied] = useState(false)

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

    function handleCopyCode() {
        if (!created?.code) return
        navigator.clipboard.writeText(created.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleGoToLeague() {
        router.push(`/leagues/${created.leagueId}`)
        onClose()
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-league-title"
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

                {!created ? (
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h2
                                    id="create-league-title"
                                    className="font-heading text-2xl text-white tracking-wide leading-none"
                                >
                                    NUEVA LIGA
                                </h2>
                                <p className="font-sans text-zinc-500 text-sm">
                                    Se genera un código único para invitar amigos
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Cerrar modal"
                                className="text-zinc-600 hover:text-white transition-colors duration-150 cursor-pointer
                                           w-8 h-8 flex items-center justify-center rounded-lg
                                           hover:bg-zinc-800
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
                                    htmlFor="league-name"
                                    className="font-sans text-sm text-zinc-400"
                                >
                                    Nombre de la liga
                                </label>
                                <input
                                    id="league-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Los pibes del trabajo"
                                    maxLength={40}
                                    autoFocus
                                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3
                                               text-white font-sans text-sm placeholder:text-zinc-600
                                               transition-colors duration-150
                                               focus:outline-none focus:border-zinc-500 focus:bg-zinc-800/80
                                               hover:border-zinc-600"
                                />
                                <span className="font-sans text-xs text-zinc-700 text-right">
                                    {name.length}/40
                                </span>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="font-sans text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-xl"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="w-full font-sans font-semibold text-sm py-3 rounded-xl
                                           transition-all duration-200 cursor-pointer
                                           disabled:opacity-40 disabled:cursor-not-allowed
                                           focus-visible:outline focus-visible:outline-2
                                           focus-visible:outline-offset-2 focus-visible:outline-[#fe3d12]"
                                style={{ background: "#fe3d12", color: "#ffffff" }}
                                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#e03510" }}
                                onMouseLeave={e => e.currentTarget.style.background = "#fe3d12"}
                            >
                                {loading ? "Creando..." : "Crear liga"}
                            </button>
                        </form>
                    </>
                ) : (
                    /* ── Estado de éxito ─────────────────────────────────── */
                    <>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ background: "#fe3d12" }}
                                        aria-hidden="true"
                                    />
                                    <span className="font-sans text-xs text-zinc-500 tracking-[0.2em] uppercase">
                                        Liga creada
                                    </span>
                                </div>
                                <h2
                                    id="create-league-title"
                                    className="font-heading text-2xl text-white tracking-wide leading-none"
                                >
                                    {created.name?.toUpperCase() ?? "LISTA"}
                                </h2>
                                <p className="font-sans text-zinc-500 text-sm mt-0.5">
                                    Compartí el código con tus amigos para que se unan.
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

                        {/* Código de invitación */}
                        <button
                            onClick={handleCopyCode}
                            aria-label={copied ? "Código copiado" : "Copiar código de invitación"}
                            className="group w-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600
                                       rounded-xl px-6 py-5 text-center
                                       transition-all duration-150 cursor-pointer
                                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <p className="font-sans text-xs text-zinc-600 mb-2 uppercase tracking-[0.2em]">
                                Código de invitación
                            </p>
                            <p className="font-heading text-5xl text-white tracking-[0.25em] leading-none mb-3">
                                {created.code}
                            </p>
                            <span className="font-sans text-xs transition-colors duration-150"
                                style={{ color: copied ? "#fe3d12" : "#525252" }}>
                                {copied ? "¡Copiado!" : "Tocá para copiar"}
                            </span>
                        </button>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleGoToLeague}
                                className="w-full font-sans font-semibold text-sm py-3 rounded-xl
                                           transition-all duration-200 cursor-pointer
                                           focus-visible:outline focus-visible:outline-2
                                           focus-visible:outline-offset-2 focus-visible:outline-[#fe3d12]"
                                style={{ background: "#fe3d12", color: "#ffffff" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#e03510"}
                                onMouseLeave={e => e.currentTarget.style.background = "#fe3d12"}
                            >
                                Ir a mi liga
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full text-zinc-500 hover:text-zinc-300 font-sans text-sm py-2.5
                                           transition-colors duration-150 cursor-pointer rounded-xl
                                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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