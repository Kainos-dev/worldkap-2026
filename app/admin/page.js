import { createGeneralLeague } from "@/actions/leagues"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
    const [totalUsers, totalMatches, totalPredictions] = await Promise.all([
        prisma.user.count(),
        prisma.match.count(),
        prisma.prediction.count(),
    ])

    const stats = [
        { label: "Usuarios registrados", value: totalUsers },
        { label: "Partidos cargados", value: totalMatches },
        { label: "Pronósticos realizados", value: totalPredictions },
    ]

    // Dentro del componente, antes del return, agregá:
    const generalLeague = await prisma.league.findFirst({
        where: { type: "GENERAL_PAID" },
    })

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-bebas text-4xl text-white tracking-wide">
                    DASHBOARD
                </h1>
                <p className="font-inter text-zinc-400 text-sm mt-1">
                    Resumen general del prode
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <p className="font-inter text-zinc-400 text-sm">{stat.label}</p>
                        <p className="font-bebas text-5xl text-white mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Liga General */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
                <div>
                    <h2 className="font-inter font-medium text-white text-sm">
                        Liga General 2026
                    </h2>
                    <p className="font-inter text-zinc-500 text-xs mt-1">
                        {generalLeague
                            ? `Creada · Código: ${generalLeague.code}`
                            : "Todavía no fue creada"}
                    </p>
                </div>

                {!generalLeague && (
                    <form action={createGeneralLeague}>
                        <button
                            type="submit"
                            className="bg-white text-zinc-900 font-inter font-medium text-sm px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                            Crear liga general
                        </button>
                    </form>
                )}

                {generalLeague && (
                    <span className="font-inter text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                        Activa
                    </span>
                )}
            </div>
        </div>
    )
}