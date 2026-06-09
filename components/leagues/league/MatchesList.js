import MatchCard from "./MatchCard"

const STAGE_LABELS = {
    GROUP: "Fase de grupos",
    ROUND_OF_32: "Ronda de 32",
    ROUND_OF_16: "Octavos de final",
    QUARTER_FINAL: "Cuartos de final",
    SEMI_FINAL: "Semifinal",
    THIRD_PLACE: "Tercer puesto",
    FINAL: "Final",
}

export default function MatchesList({ matches, predictions }) {
    // Agrupar por fase
    const byStage = matches.reduce((acc, match) => {
        if (!acc[match.stage]) acc[match.stage] = []
        acc[match.stage].push(match)
        return acc
    }, {})

    const stageOrder = [
        "GROUP",
        "ROUND_OF_32",
        "ROUND_OF_16",
        "QUARTER_FINAL",
        "SEMI_FINAL",
        "THIRD_PLACE",
        "FINAL",
    ]

    return (
        <div className="flex flex-col gap-8">
            {stageOrder.map((stage) => {
                const stageMatches = byStage[stage]
                if (!stageMatches?.length) return null

                return (
                    <div key={stage} className="flex flex-col gap-3">
                        <h2 className="font-bebas text-lg text-zinc-500 tracking-widest uppercase">
                            {STAGE_LABELS[stage]}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {stageMatches.map((match) => (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    prediction={predictions[match.id] ?? null}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}