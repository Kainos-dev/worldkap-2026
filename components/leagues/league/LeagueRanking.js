import Image from "next/image"

// Tratamiento visual del top 3 dentro de la paleta del sistema
// Se evitan amarillo/gold que son ajenos a la identidad definida.
// En su lugar: el #1 usa el rojo de marca (logro máximo),
// el #2 y #3 usan zinc en descenso (jerarquía neutra y limpia).
const POSITION_STYLES = {
    1: { color: "#fe3d12", label: "1º" },
    2: { color: "#e4e4e7", label: "2º" },
    3: { color: "#71717a", label: "3º" },
}

function Avatar({ image, name, size = 32 }) {
    const initials = name
        ?.split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") ?? "?"

    if (image) {
        return (
            <Image
                src={image}
                alt={name ?? ""}
                width={size}
                height={size}
                className="rounded-full shrink-0 object-cover"
                style={{ width: size, height: size }}
            />
        )
    }

    return (
        <div
            className="rounded-full bg-zinc-800 flex items-center justify-center shrink-0"
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            <span className="font-sans text-xs text-zinc-400 font-medium">
                {initials}
            </span>
        </div>
    )
}

export default function LeagueRanking({ ranking, currentUserId }) {
    if (ranking.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-16">
                <p className="font-sans text-zinc-600 text-sm text-center">
                    Todavía no hay puntos registrados.
                    <br />
                    <span className="text-zinc-700">
                        Los puntos aparecen cuando terminen los partidos.
                    </span>
                </p>
            </div>
        )
    }

    // Separar top 3 del resto para tratamiento visual diferenciado
    const top3 = ranking.filter((m) => m.position <= 3)
    const rest = ranking.filter((m) => m.position > 3)

    return (
        <div className="flex flex-col gap-1">

            {/* ── Top 3 ──────────────────────────────────────────────── */}
            {top3.map((member) => {
                const posStyle = POSITION_STYLES[member.position]
                const isCurrentUser = member.userId === currentUserId

                return (
                    <div
                        key={member.userId}
                        className={`
                            flex items-center gap-3 px-4 py-3.5 rounded-xl
                            transition-colors duration-150
                            ${isCurrentUser
                                ? "bg-zinc-800/80 border border-zinc-700/60"
                                : "bg-zinc-900/60 border border-transparent hover:bg-zinc-900 hover:border-zinc-800/60"
                            }
                        `}
                    >
                        {/* Número de posición */}
                        <span
                            className="font-heading text-2xl leading-none w-7 text-center shrink-0"
                            style={{ color: posStyle.color }}
                            aria-label={`Posición ${posStyle.label}`}
                        >
                            {member.position}
                        </span>

                        {/* Avatar */}
                        <Avatar image={member.image} name={member.name} size={32} />

                        {/* Nombre */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="font-sans font-medium text-sm text-white truncate">
                                {member.name}
                            </span>
                            {isCurrentUser && (
                                <span
                                    className="font-sans text-[9px] font-medium px-1.5 py-0.5 rounded-full border shrink-0"
                                    style={{ color: "#fe3d12", borderColor: "#fe3d1230", background: "#fe3d1210" }}
                                >
                                    vos
                                </span>
                            )}
                        </div>

                        {/* Puntos */}
                        <div className="flex items-baseline gap-1 shrink-0">
                            <span className="font-heading text-2xl text-white leading-none">
                                {member.points}
                            </span>
                            <span className="font-sans text-[10px] text-zinc-600">pts</span>
                        </div>
                    </div>
                )
            })}

            {/* Divisor si hay resto */}
            {rest.length > 0 && top3.length > 0 && (
                <div className="h-px bg-zinc-800/60 my-1 mx-1" aria-hidden="true" />
            )}

            {/* ── Resto del ranking ──────────────────────────────────── */}
            {rest.map((member) => {
                const isCurrentUser = member.userId === currentUserId

                return (
                    <div
                        key={member.userId}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-colors duration-150
                            ${isCurrentUser
                                ? "bg-zinc-800/80 border border-zinc-700/60"
                                : "border border-transparent hover:bg-zinc-900/40 hover:border-zinc-800/40"
                            }
                        `}
                    >
                        {/* Posición */}
                        <span className="font-sans text-sm text-zinc-600 w-7 text-center shrink-0 tabular-nums">
                            {member.position}
                        </span>

                        {/* Avatar */}
                        <Avatar image={member.image} name={member.name} size={28} />

                        {/* Nombre */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="font-sans text-sm text-zinc-300 truncate">
                                {member.name}
                            </span>
                            {isCurrentUser && (
                                <span
                                    className="font-sans text-[9px] font-medium px-1.5 py-0.5 rounded-full border shrink-0"
                                    style={{ color: "#fe3d12", borderColor: "#fe3d1230", background: "#fe3d1210" }}
                                >
                                    vos
                                </span>
                            )}
                        </div>

                        {/* Puntos */}
                        <div className="flex items-baseline gap-1 shrink-0">
                            <span className="font-sans text-sm text-zinc-400 tabular-nums">
                                {member.points}
                            </span>
                            <span className="font-sans text-[10px] text-zinc-700">pts</span>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}