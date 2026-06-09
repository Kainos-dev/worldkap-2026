import Image from "next/image"

export default function LeagueRanking({ ranking, currentUserId }) {
    if (ranking.length === 0) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                <p className="font-inter text-zinc-500 text-sm">
                    Todavía no hay puntos registrados
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {ranking.map((member) => (
                <div
                    key={member.userId}
                    className={`
            flex items-center gap-4 px-5 py-4 rounded-2xl border transition-colors
            ${member.isCurrentUser
                            ? "bg-zinc-800 border-zinc-600"
                            : "bg-zinc-900 border-zinc-800"
                        }
          `}
                >
                    {/* Posición */}
                    <span className={`
            font-bebas text-2xl w-8 text-center shrink-0
            ${member.position === 1 ? "text-yellow-400" :
                            member.position === 2 ? "text-zinc-300" :
                                member.position === 3 ? "text-amber-600" :
                                    "text-zinc-600"}
          `}>
                        {member.position}
                    </span>

                    {/* Avatar */}
                    {member.image ? (
                        <Image
                            src={member.image}
                            alt={member.name ?? ""}
                            width={36}
                            height={36}
                            className="rounded-full shrink-0"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                            <span className="font-inter text-sm text-white">
                                {member.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Nombre */}
                    <div className="flex-1 min-w-0">
                        <span className="font-inter font-medium text-white text-sm truncate block">
                            {member.name}
                            {member.isCurrentUser && (
                                <span className="font-inter text-xs text-zinc-500 ml-2">
                                    (vos)
                                </span>
                            )}
                        </span>
                    </div>

                    {/* Puntos */}
                    <span className="font-bebas text-2xl text-white shrink-0">
                        {member.points}
                        <span className="font-inter text-xs text-zinc-500 ml-1">pts</span>
                    </span>
                </div>
            ))}
        </div>
    )
}