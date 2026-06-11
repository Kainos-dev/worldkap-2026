"use client"
import Link from "next/link"
import Image from "next/image"
import worldKapLogo from "@/public/worldKap_logo.png"

export default function Hero({ isLoggedIn }) {
    return (
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 font-sans">

            {/* Campo de fútbol — líneas decorativas ultra-sutiles */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                {/* Línea central */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-[0.03]" />
                {/* Círculo central */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white opacity-[0.03]" />
                {/* Punto central */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-[0.06]" />
            </div>

            {/* Acento de luz superior — sutil */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] opacity-20"
                style={{ background: "linear-gradient(90deg, transparent 0%, #fe3d12 50%, transparent 100%)" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl w-full">

                {/* Logo */}
                

                {/* Eyebrow */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-zinc-700" aria-hidden="true" />
                    <span className="font-inter text-xs tracking-[0.3em] text-zinc-500 uppercase">
                        FIFA World Cup 2026
                    </span>
                    <div className="w-8 h-px bg-zinc-700" aria-hidden="true" />
                </div>

                {/* Título principal */}
                {/* <div className="flex flex-col items-center gap-0">
                    <h1 className="font-heading leading-none text-white tracking-wide"
                        style={{ fontSize: "clamp(5rem, 14vw, 10rem)" }}>
                        PRODE
                    </h1>
                    <span
                        className="font-heading leading-none tracking-wide"
                        style={{
                            fontSize: "clamp(5rem, 14vw, 10rem)",
                            color: "#fe3d12",
                        }}
                    >
                        MUNDIAL
                    </span>
                </div> */}


                {/* LOGO */}
                <Image
                    src={worldKapLogo}
                    alt="WorldKap 2026"
                    width={400}
                    height={400}
                    className="w-20 h-20 sm:w-125 sm:h-125 object-contain"
                    priority // importante: está above the fold
                />

                {/* Descriptor */}
                <p className="font-inter text-zinc-400 text-base sm:text-lg max-w-md leading-relaxed -mt-2">
                    Predecí los <span className="text-white font-medium">104 partidos</span>, acumulá puntos
                    y competí por el pozo con jugadores de todo el país.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full max-w-sm sm:max-w-md mt-1">
                    <Link
                        href={isLoggedIn ? "/leagues" : "/login"}
                        className="flex-1 font-semibold text-sm px-6 py-3.5 rounded-xl text-center transition-all duration-200
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe3d12]"
                        style={{
                            background: "#fe3d12",
                            color: "#ffffff",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e03510"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fe3d12"}
                    >
                        Liga General
                    </Link>
                    <Link
                        href={isLoggedIn ? "/leagues/private" : "/login"}
                        className="
                            flex-1 border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-whitefont-medium
                            text-sm px-6 py-3.5 rounded-xl text-center transition-all duration-200
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Ligas privadas
                    </Link>
                </div>

                {/* Info secundaria */}
                {!isLoggedIn && (
                    <p className="font-inter text-zinc-600 text-xs -mt-2">
                        Iniciá sesión con Google · Ligas con amigos gratis
                    </p>
                )}

            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div
                    className="w-px h-10 opacity-20"
                    style={{ background: "linear-gradient(to bottom, #737373, transparent)" }}
                    aria-hidden="true"
                />
                <span className="font-inter text-[10px] text-zinc-600 tracking-[0.2em] uppercase">
                    scroll
                </span>
            </div>

        </section>
    )
}