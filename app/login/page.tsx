import { signIn } from "@/lib/auth"

export default function LoginPage() {
    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-zinc-950">

            {/* ── Panel izquierdo: identidad de marca ─────────────────────── */}
            <div className="relative flex flex-col items-center justify-center lg:items-start lg:justify-end
                            px-8 py-16 lg:px-16 lg:py-20
                            lg:w-1/2 overflow-hidden
                            bg-zinc-950 border-b border-zinc-900 lg:border-b-0 lg:border-r lg:border-zinc-900">

                {/* Líneas de campo — decoración ultra-sutil */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-[0.025]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-56 h-56 rounded-full border border-white opacity-[0.025]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-1.5 h-1.5 rounded-full bg-white opacity-[0.05]" />
                </div>

                {/* Línea de acento superior */}
                <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-px opacity-30"
                    style={{ background: "linear-gradient(90deg, #fe3d12 0%, transparent 60%)" }}
                />

                {/* Contenido de marca */}
                <div className="relative z-10 flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
                    <span className="font-sans text-xs tracking-[0.3em] text-zinc-600 uppercase">
                        FIFA World Cup 2026
                    </span>

                    <div className="flex flex-col leading-none">
                        <span
                            className="font-heading text-white tracking-wide"
                            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
                        >
                            PRODE
                        </span>
                        <span
                            className="font-heading tracking-wide"
                            style={{
                                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                                color: "#fe3d12",
                            }}
                        >
                            MUNDIAL
                        </span>
                    </div>

                    <p className="font-sans text-zinc-500 text-sm max-w-xs leading-relaxed">
                        Predecí los 104 partidos del Mundial y competí por el pozo con jugadores de todo el país.
                    </p>
                </div>
            </div>

            {/* ── Panel derecho: formulario de acceso ─────────────────────── */}
            <div className="flex flex-col items-center justify-center
                            px-8 py-16 lg:px-16 lg:py-20
                            lg:w-1/2">
                <div className="w-full max-w-sm flex flex-col gap-8">

                    {/* Encabezado del form */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-heading text-3xl text-white tracking-wide leading-none">
                            INGRESÁ
                        </h1>
                        <p className="font-sans text-zinc-500 text-sm leading-relaxed">
                            Usá tu cuenta de Google para crear o unirte a una liga.
                        </p>
                    </div>

                    {/* Divisor */}
                    <div className="h-px bg-zinc-900" aria-hidden="true" />

                    {/* Botón Google — Server Action */}
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/" })
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3
                                       bg-white hover:bg-zinc-100 active:bg-zinc-200
                                       text-zinc-900 font-sans font-medium text-sm
                                       py-3.5 px-6 rounded-xl
                                       transition-colors duration-200 cursor-pointer
                                       focus-visible:outline focus-visible:outline-2
                                       focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            {/* Google G logo */}
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5 shrink-0"
                                viewBox="0 0 24 24"
                            >
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuar con Google
                        </button>
                    </form>

                    {/* Nota legal */}
                    <p className="font-sans text-zinc-700 text-xs text-center leading-relaxed">
                        Al ingresar aceptás los términos y condiciones del prode.
                    </p>

                </div>
            </div>

        </main>
    )
}