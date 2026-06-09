"use client"

import { useState } from "react"
import MatchesList from "./MatchesList"
import LeagueRanking from "./LeagueRanking"

const TABS = [
    { id: "matches", label: "Partidos" },
    { id: "ranking", label: "Ranking" },
    { id: "info", label: "Info" },
]

export default function LeagueTabs({
    matches,
    predictions,
    ranking,
    league,
    currentUserId,
}) {
    const [activeTab, setActiveTab] = useState("matches")

    return (
        <div className="flex flex-col gap-6">

            {/* Tab buttons */}
            <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              font-inter text-sm px-5 py-2 rounded-lg transition-colors cursor-pointer
              ${activeTab === tab.id
                                ? "bg-white text-zinc-900 font-semibold"
                                : "text-zinc-400 hover:text-white"
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contenido */}
            {activeTab === "matches" && (
                <MatchesList
                    matches={matches}
                    predictions={predictions}
                />
            )}

            {activeTab === "ranking" && (
                <LeagueRanking
                    ranking={ranking}
                    currentUserId={currentUserId}
                />
            )}

            {activeTab === "info" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                    <h2 className="font-bebas text-2xl text-white tracking-wide">
                        INFO DE LA LIGA
                    </h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                            <span className="font-inter text-sm text-zinc-400">Nombre</span>
                            <span className="font-inter text-sm text-white">{league.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                            <span className="font-inter text-sm text-zinc-400">Tipo</span>
                            <span className="font-inter text-sm text-white">
                                {league.type === "GENERAL_PAID" ? "Liga General · Paga" : "Liga Privada · Gratis"}
                            </span>
                        </div>
                        {league.type === "PRIVATE_FREE" && (
                            <div className="flex justify-between items-center">
                                <span className="font-inter text-sm text-zinc-400">Código de invitación</span>
                                <span className="font-bebas text-xl text-white tracking-widest">
                                    {league.code}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}