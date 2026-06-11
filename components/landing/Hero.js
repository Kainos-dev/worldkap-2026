"use client"
import Link from "next/link"
import Image from "next/image"
import worldKapLogo from "@/public/logoprode4.png"

export default function Hero({ isLoggedIn }) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 py-20 font-sans">

            {/* Líneas decorativas campo */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-[0.03]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white opacity-[0.03]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-[0.06]" />
            </div>

            {/* Acento superior */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] opacity-20"
                style={{ background: "linear-gradient(90deg, transparent 0%, #fe3d12 50%, transparent 100%)" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full gap-5 sm:gap-7">

                {/* Eyebrow */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-zinc-700" aria-hidden="true" />
                    <span className="font-sans text-xs tracking-[0.3em] text-zinc-500 uppercase">
                        FIFA World Cup 2026
                    </span>
                    <div className="w-8 h-px bg-zinc-700" aria-hidden="true" />
                </div>

                {/* Logo — escala fluida entre mobile y desktop */}
                <Image
                    src={worldKapLogo}
                    alt="WorldKap 2026"
                    width={400}
                    height={400}
                    className="w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain"
                    priority
                />

                {/* Descriptor */}
                <p className="font-sans text-zinc-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
                    Predecí los <span className="text-white font-medium">104 partidos</span>, acumulá puntos
                    y competí por el pozo con jugadores de todo el país.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-xs sm:max-w-sm">
                    <Link
                        href={isLoggedIn ? "/leagues" : "/login"}
                        className="flex-1 font-semibold text-sm px-6 py-3.5 rounded-xl text-center transition-all duration-200
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe3d12]"
                        style={{ background: "#fe3d12", color: "#ffffff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e03510"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fe3d12"}
                    >
                        Liga General
                    </Link>
                    <Link
                        href={isLoggedIn ? "/leagues/private" : "/login"}
                        className="flex-1 border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white
                                   font-medium text-sm px-6 py-3.5 rounded-xl text-center transition-all duration-200
                                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Ligas Privadas
                    </Link>
                </div>

                {/* Info secundaria */}
                {!isLoggedIn && (
                    <p className="font-sans text-zinc-600 text-xs">
                        Iniciá sesión con Google · Ligas con amigos gratis
                    </p>
                )}

            </div>

            {/* Scroll indicator — separado del flujo para no amontonarse */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                <div
                    className="w-px h-8 opacity-20"
                    style={{ background: "linear-gradient(to bottom, #737373, transparent)" }}
                    aria-hidden="true"
                />
                <span className="font-sans text-[10px] text-zinc-600 tracking-[0.2em] uppercase">
                    scroll
                </span>
            </div>

        </section>
    )
}