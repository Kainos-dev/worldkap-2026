"use client"

import { useState } from "react"
import Link from "next/link"
import CreatePrivateLeagueModal from "./CreatePrivateLeagueModal"
import JoinPrivateLeagueModal from "./JoinPrivateLeagueModal"

const BRAND = "#fe3d12"

const FEATURES = [
    "Sin límite de participantes",
    "Código único para invitar",
    "Tabla de posiciones en tiempo real",
    "Solo puedes crear una liga privada, pero podés unirte a todas las que quieras.",
]

export default function PrivateLeagueCard({ privateLeagues }) {
    const [showCreate, setShowCreate] = useState(false)
    const [showJoin, setShowJoin] = useState(false)

    const hasLeagues = privateLeagues.length > 0

    return (
        <>
            <div className="bg-[#111111] border border-zinc-800 hover:border-zinc-700/60 rounded-2xl p-6
                            flex flex-col gap-5 transition-colors duration-200 w-full">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <span className="font-sans text-[10px] text-zinc-600 tracking-[0.18em] uppercase">
                            Liga privada
                        </span>
                        <h2 className="font-heading text-[1.75rem] text-white tracking-wide leading-none mt-1">
                            CON AMIGOS
                        </h2>
                    </div>

                    {hasLeagues ? (
                        <div
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 border text-xs font-sans font-semibold"
                            style={{
                                background: `${BRAND}0d`,
                                borderColor: `${BRAND}25`,
                                color: BRAND,
                            }}
                        >
                            <i className="ti ti-users text-[13px]" aria-hidden="true" />
                            {privateLeagues.length} {privateLeagues.length === 1 ? "liga" : "ligas"}
                        </div>
                    ) : (
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0"
                            style={{ background: `${BRAND}0d`, borderColor: `${BRAND}25` }}
                        >
                            <i className="ti ti-users text-[18px]" style={{ color: BRAND }} aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* Estado vacío */}
                {!hasLeagues && (
                    <div className="flex flex-col gap-3 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-4">
                        <p className="font-sans text-sm text-zinc-500 leading-relaxed">
                            Creá una liga privada y compartí el código con tus amigos. Gratis, sin apuesta.
                        </p>
                        <div className="flex flex-col gap-1.5 mt-1">
                            {FEATURES.map((feat) => (
                                <div key={feat} className="flex items-center gap-2">
                                    <i
                                        className="ti ti-check text-[13px] flex-shrink-0"
                                        style={{ color: BRAND }}
                                        aria-hidden="true"
                                    />
                                    <span className="font-sans text-xs text-zinc-600">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ligas existentes */}
                {hasLeagues && (
                    <div className="flex flex-col gap-1.5">
                        {privateLeagues.map(({ league }) => {
                            const isAdmin = league.isAdmin
                            return (
                                <Link
                                    key={league.id}
                                    href={`/leagues/${league.id}`}
                                    className="group flex items-center justify-between bg-zinc-950 rounded-xl px-3.5 py-3
                                               border transition-all duration-150
                                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                    style={{
                                        borderColor: isAdmin ? `${BRAND}35` : "#27272a",
                                    }}
                                >
                                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-sans text-sm text-white font-semibold truncate">
                                                {league.name}
                                            </span>
                                            {isAdmin && (
                                                <span
                                                    className="inline-block text-[10px] font-sans font-semibold px-1.5 py-px
                                                               rounded border tracking-wide uppercase flex-shrink-0"
                                                    style={{
                                                        background: `${BRAND}10`,
                                                        color: BRAND,
                                                        borderColor: `${BRAND}25`,
                                                    }}
                                                >
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-sans text-xs text-zinc-600">
                                                {league._count.members} jugadores
                                            </span>
                                            <span className="text-zinc-800 text-xs" aria-hidden="true">·</span>
                                            <span className="font-mono text-xs text-zinc-700 tracking-wider">
                                                {league.code}
                                            </span>
                                        </div>
                                    </div>
                                    <i
                                        className="ti ti-chevron-right text-base flex-shrink-0 ml-2 transition-colors duration-150
                                                   group-hover:text-zinc-400"
                                        style={{ color: isAdmin ? BRAND : "#3f3f46" }}
                                        aria-hidden="true"
                                    />
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Acciones */}
                <div className="flex flex-col gap-2 mt-auto pt-1">
                    <button
                        onClick={() => setShowCreate(true)}
                        className="w-full font-sans font-bold text-sm py-3 rounded-xl transition-all duration-150
                                   cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                   active:scale-[0.98]"
                        style={{ background: BRAND, color: "#ffffff", outlineColor: BRAND }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e03510"}
                        onMouseLeave={e => e.currentTarget.style.background = BRAND}
                    >
                        Crear liga privada
                    </button>
                    <button
                        onClick={() => setShowJoin(true)}
                        className="w-full border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-200
                                   font-sans font-medium text-sm py-3 rounded-xl transition-all duration-150
                                   cursor-pointer active:scale-[0.98]
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Unirme con código
                    </button>
                </div>

            </div>

            {showCreate && <CreatePrivateLeagueModal onClose={() => setShowCreate(false)} />}
            {showJoin && <JoinPrivateLeagueModal onClose={() => setShowJoin(false)} />}
        </>
    )
}