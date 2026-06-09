export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Predecí",
            description: "Ingresá el marcador exacto de cada partido antes de que arranque.",
        },
        {
            number: "02",
            title: "Sumá puntos",
            description: "3 puntos por resultado exacto, 1 punto si acertás el ganador.",
        },
        {
            number: "03",
            title: "Ganá el pozo",
            description: "Los 3 mejores del ranking general se reparten el premio.",
        },
    ]

    return (
        <section className="bg-zinc-950 border-y border-zinc-900 py-24 px-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-16">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <span className="font-inter text-xs tracking-[0.25em] text-zinc-600 uppercase block mb-3">
                            Cómo funciona
                        </span>
                        <h2 className="font-bebas text-5xl text-white tracking-wide leading-none">
                            SIMPLE DE JUGAR
                        </h2>
                    </div>
                    <p className="font-inter text-zinc-500 text-sm max-w-xs sm:text-right leading-relaxed">
                        Sin registros complicados. Predecís, esperás los resultados y ves cómo subís en el ranking.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-px bg-transparent sm:bg-zinc-900 rounded-2xl overflow-hidden">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="relative flex flex-col gap-6 p-8 bg-zinc-950 sm:bg-zinc-950 border border-zinc-900 sm:border-0 rounded-2xl sm:rounded-none first:rounded-t-2xl last:rounded-b-2xl sm:first:rounded-l-2xl sm:last:rounded-r-2xl"
                        >
                            {/* Número decorativo */}
                            <span
                                className="font-bebas leading-none select-none pointer-events-none"
                                style={{
                                    fontSize: "clamp(4rem, 8vw, 6rem)",
                                    color: "transparent",
                                    WebkitTextStroke: "1px #27272a",
                                }}
                                aria-hidden="true"
                            >
                                {step.number}
                            </span>

                            {/* Contenido */}
                            <div className="flex flex-col gap-2">
                                <h3 className="font-bebas text-2xl text-white tracking-wide">
                                    {step.title}
                                </h3>
                                <p className="font-inter text-zinc-500 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Divisor vertical entre columnas (solo desktop, entre items) */}
                            {i < steps.length - 1 && (
                                <div
                                    className="hidden sm:block absolute top-8 bottom-8 right-0 w-px bg-zinc-900"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}