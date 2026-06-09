"use client"

import { useState } from "react"
import Link from "next/link"
import CreatePrivateLeagueModal from "./CreatePrivateLeagueModal"
import JoinPrivateLeagueModal from "./JoinPrivateLeagueModal"

export default function PrivateLeagueCard({ privateLeagues }) {
    const [showCreate, setShowCreate] = useState(false)
    const [showJoin, setShowJoin] = useState(false)

    const hasLeagues = privateLeagues.length > 0

    return (
        <>
            <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-6 flex flex-col gap-6 transition-colors duration-200">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <span className="font-inter text-xs text-zinc-600 tracking-[0.2em] uppercase">
                        Liga Privada
                    </span>
                    <h2 className="font-bebas text-3xl text-white tracking-wide leading-none">
                        CON AMIGOS
                    </h2>
                </div>

                {/* Estado vacío */}
                {!hasLeagues && (
                    <div className="flex flex-col gap-3 py-2">
                        <p className="font-inter text-sm text-zinc-500 leading-relaxed">
                            Creá una liga privada y compartí el código con tus amigos.
                            Gratis, sin apuesta.
                        </p>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: "#fe3d12" }}
                                aria-hidden="true"
                            />
                            <span className="font-inter text-xs text-zinc-600">
                                Sin límite de participantes
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: "#fe3d12" }}
                                aria-hidden="true"
                            />
                            <span className="font-inter text-xs text-zinc-600">
                                Código único para invitar
                            </span>
                        </div>
                    </div>
                )}

                {/* Ligas existentes */}
                {hasLeagues && (
                    <div className="flex flex-col gap-1.5">
                        {privateLeagues.map(({ league }) => (
                            <Link
                                key={league.id}
                                href={`/leagues/${league.id}`}
                                className="group flex items-center justify-between bg-zinc-800/40 hover:bg-zinc-800 border border-transparent hover:border-zinc-700/50 rounded-xl px-4 py-3 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                    <span className="font-inter text-sm text-white font-medium truncate">
                                        {league.name}
                                    </span>
                                    <div className="flex items-center gap-2 text-zinc-600">
                                        <span className="font-inter text-xs">
                                            {league._count.members} jugadores
                                        </span>
                                        <span className="text-zinc-800" aria-hidden="true">·</span>
                                        <span className="font-inter text-xs font-mono tracking-wider">
                                            {league.code}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className="text-zinc-700 group-hover:text-zinc-400 transition-colors text-sm shrink-0 ml-3"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto pt-2">
                    <button
                        onClick={() => setShowCreate(true)}
                        className="w-full font-inter font-semibold text-sm py-3 rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe3d12]"
                        style={{ background: "#fe3d12", color: "#ffffff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e03510"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fe3d12"}
                    >
                        Crear liga privada
                    </button>
                    <button
                        onClick={() => setShowJoin(true)}
                        className="w-full border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 font-inter font-medium text-sm py-3 rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Unirme con código
                    </button>
                </div>

            </div>

            {showCreate && (
                <CreatePrivateLeagueModal onClose={() => setShowCreate(false)} />
            )}
            {showJoin && (
                <JoinPrivateLeagueModal onClose={() => setShowJoin(false)} />
            )}
        </>
    )
}