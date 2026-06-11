"use client"

import { useState } from "react"
import Link from "next/link"
import JoinGeneralButton from "./JoinGeneralButton"

const ENTRY_AMOUNT = 5000
const BRAND = "#fe3d12"

const PRIZES = [
    { pos: "1°", pct: "50%", icon: "ti-medal" },
    { pos: "2°", pct: "30%", icon: "ti-medal-2" },
    { pos: "3°", pct: "20%", icon: "ti-medal-2" },
]

const PRIZE_COLORS = ["#eab308", "#71717a", "#52525b"]

function StatRow({ label, children }) {
    return (
        <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-zinc-500">{label}</span>
            {children}
        </div>
    )
}

function StatsBox({ memberCount, className = "", style = {} }) {
    return (
        <div
            className={`bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2.5 ${className}`}
            style={style}
        >
            <StatRow label="Jugadores anotados">
                <span className="font-sans text-sm text-zinc-200 font-semibold">{memberCount}</span>
            </StatRow>
            <div className="h-px bg-zinc-900" />
            <StatRow label="Pozo actual">
                <span className="font-heading text-xl text-yellow-400 tracking-wide">
                    ${(memberCount * ENTRY_AMOUNT).toLocaleString("es-AR")}
                </span>
            </StatRow>
        </div>
    )
}

// ---------- Estado: participando ----------
function ParticipatingState({ league, memberCount }) {
    return (
        <div className="bg-[#111111] border border-yellow-500/30 rounded-2xl p-6 flex flex-col gap-5">

            <div className="flex items-start justify-between">
                <div>
                    <span className="font-sans text-[10px] text-yellow-600 tracking-[0.18em] uppercase">
                        Liga general
                    </span>
                    <h2 className="font-heading text-[1.65rem] text-white tracking-wide leading-none mt-1">
                        MUNDIAL 2026
                    </h2>
                </div>
                <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full
                                 bg-green-400/8 text-green-400 border border-green-400/20 flex-shrink-0">
                    Participando
                </span>
            </div>

            <StatsBox
                memberCount={memberCount}
                style={{ borderColor: "rgba(234,179,8,0.15)" }}
            />

            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl
                            bg-green-400/[0.04] border border-green-400/10">
                <i className="ti ti-circle-check text-lg text-green-400 flex-shrink-0" aria-hidden="true" />
                <p className="font-sans text-xs text-zinc-500 leading-relaxed">
                    Tu lugar está confirmado. Hacé tus predicciones antes del primer partido.
                </p>
            </div>

            <Link
                href={`/leagues/${league.id}`}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-sans font-bold
                           text-sm py-3 rounded-xl transition-colors text-center mt-auto
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
            >
                Ver mi liga →
            </Link>
        </div>
    )
}

// ---------- Estado: pago pendiente ----------
function PendingPaymentState() {
    return (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
            <div>
                <span className="font-sans text-[10px] text-zinc-600 tracking-[0.18em] uppercase">
                    Liga general
                </span>
                <h2 className="font-heading text-[1.65rem] text-white tracking-wide leading-none mt-1">
                    MUNDIAL 2026
                </h2>
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl
                            bg-yellow-400/[0.04] border border-yellow-500/15">
                <i className="ti ti-clock text-xl text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">
                    Tu pago está siendo procesado. En breve vas a poder competir.
                </p>
            </div>
        </div>
    )
}

// ---------- Estado: default (no inscripto) ----------
function DefaultState({ memberCount }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handlePay() {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/payments/create", { method: "POST" })
            const data = await res.json()
            if (data.error) {
                setError(data.error)
                setLoading(false)
                return
            }
            window.location.href = data.url
        } catch {
            setError("Ocurrió un error. Intentá de nuevo.")
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#111111] border border-zinc-800 hover:border-zinc-700/60 rounded-2xl p-6
                        flex flex-col gap-5 transition-colors duration-200">

            <div className="flex items-start justify-between">
                <div>
                    <span className="font-sans text-[10px] text-zinc-600 tracking-[0.18em] uppercase">
                        Liga general
                    </span>
                    <h2 className="font-heading text-[1.65rem] text-white tracking-wide leading-none mt-1">
                        MUNDIAL 2026
                    </h2>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0
                                bg-yellow-500/8 border-yellow-500/20">
                    <i className="ti ti-trophy text-[18px] text-yellow-400" aria-hidden="true" />
                </div>
            </div>

            <p className="font-sans text-sm text-zinc-500 leading-relaxed -mt-1">
                Competí contra todos los participantes. Los 3 mejores se reparten el pozo.
            </p>

            {/* Stats */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                <StatRow label="Entrada">
                    <span className="font-heading text-2xl text-white tracking-wide">
                        ${ENTRY_AMOUNT.toLocaleString("es-AR")}
                    </span>
                </StatRow>
                <div className="h-px bg-zinc-900" />
                <StatRow label="Jugadores anotados">
                    <span className="font-sans text-sm text-zinc-200 font-semibold">{memberCount}</span>
                </StatRow>
                <StatRow label="Pozo actual">
                    <span className="font-heading text-xl text-yellow-400 tracking-wide">
                        ${(memberCount * ENTRY_AMOUNT).toLocaleString("es-AR")}
                    </span>
                </StatRow>
            </div>

            {/* Premios */}
            <div className="flex flex-col gap-1.5">
                {PRIZES.map(({ pos, pct, icon }, i) => (
                    <div
                        key={pos}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-950"
                    >
                        <div className="flex items-center gap-2">
                            <i
                                className={`ti ${icon} text-sm`}
                                style={{ color: PRIZE_COLORS[i] }}
                                aria-hidden="true"
                            />
                            <span className="font-sans text-xs text-zinc-400">{pos} puesto</span>
                        </div>
                        <span
                            className="font-sans text-xs font-bold"
                            style={{ color: PRIZE_COLORS[i] }}
                        >
                            {pct} del pozo
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2 mt-auto">
                {error && (
                    <p className="font-sans text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                        {error}
                    </p>
                )}
                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full font-sans font-bold text-sm py-3 rounded-xl transition-all duration-150
                               active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    style={{ background: BRAND, color: "#fff" }}
                >
                    {loading
                        ? "Redirigiendo..."
                        : `Apostar $${ENTRY_AMOUNT.toLocaleString("es-AR")} y entrar`}
                </button>
            </div>
        </div>
    )
}

// ---------- Componente principal ----------
export default function GeneralLeagueCard({ league, isInLeague, hasPaid, memberCount }) {
    if (isInLeague && hasPaid) return <ParticipatingState league={league} memberCount={memberCount} />
    if (isInLeague && !hasPaid) return <PendingPaymentState />
    return <DefaultState memberCount={memberCount} />
}