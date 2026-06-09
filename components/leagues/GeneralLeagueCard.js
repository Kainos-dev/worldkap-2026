import Link from "next/link"

import JoinGeneralButton from "./JoinGeneralButton"

const ENTRY_AMOUNT = 5000


export default function GeneralLeagueCard({
    league,
    isInLeague,
    hasPaid,
    memberCount,
}) {
    // Ya está adentro y pagó
    if (isInLeague && hasPaid) {
        return (
            <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="font-inter text-xs text-yellow-400 tracking-widest uppercase">
                            Liga General
                        </span>
                        <h2 className="font-bebas text-3xl text-white tracking-wide">
                            MUNDIAL 2026
                        </h2>
                    </div>
                    <span className="font-inter text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                        Participando
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-zinc-500">Jugadores</span>
                        <span className="font-inter text-sm text-white font-medium">
                            {memberCount}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-zinc-500">Pozo estimado</span>
                        <span className="font-bebas text-xl text-yellow-400">
                            ${(memberCount * ENTRY_AMOUNT).toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/leagues/${league.id}`}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors text-center"
                >
                    Ver mi liga →
                </Link>
            </div>
        )
    }

    // Está registrado pero no pagó (caso raro, por si acaso)
    if (isInLeague && !hasPaid) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <span className="font-inter text-xs text-zinc-500 tracking-widest uppercase">
                        Liga General
                    </span>
                    <h2 className="font-bebas text-3xl text-white tracking-wide">
                        MUNDIAL 2026
                    </h2>
                </div>
                <p className="font-inter text-sm text-zinc-400">
                    Tu pago está siendo procesado. En breve vas a poder competir.
                </p>
            </div>
        )
    }

    // No está en la liga todavía
    return (
        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex flex-col gap-6 transition-colors">

            <div className="flex flex-col gap-1">
                <span className="font-inter text-xs text-zinc-500 tracking-widest uppercase">
                    Liga General
                </span>
                <h2 className="font-bebas text-3xl text-white tracking-wide">
                    MUNDIAL 2026
                </h2>
            </div>

            <div className="flex flex-col gap-3">
                <p className="font-inter text-sm text-zinc-400 leading-relaxed">
                    Competí contra todos los participantes. Los 3 mejores se reparten el pozo.
                </p>

                <div className="flex flex-col gap-2 bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-zinc-500">Entrada</span>
                        <span className="font-bebas text-2xl text-white">
                            ${ENTRY_AMOUNT.toLocaleString("es-AR")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-zinc-500">Jugadores anotados</span>
                        <span className="font-inter text-sm text-white">{memberCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-zinc-500">Pozo actual</span>
                        <span className="font-bebas text-xl text-yellow-400">
                            ${(memberCount * ENTRY_AMOUNT).toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xs">✓</span>
                        <span className="font-inter text-xs text-zinc-400">
                            1° puesto: 50% del pozo
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xs">✓</span>
                        <span className="font-inter text-xs text-zinc-400">
                            2° puesto: 30% del pozo
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xs">✓</span>
                        <span className="font-inter text-xs text-zinc-400">
                            3° puesto: 20% del pozo
                        </span>
                    </div>
                </div>
            </div>

            <Link
                href="/leagues/join-general"
                className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors text-center"
            >
                Apostar ${ENTRY_AMOUNT.toLocaleString("es-AR")} y entrar
            </Link>


            <JoinGeneralButton />
        </div>
    )
}