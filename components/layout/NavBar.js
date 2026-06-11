import { auth } from "@/lib/auth"
import UserMenu from "@/components/auth/UserMenu"
import Link from "next/link"

export default async function Navbar() {
    const session = await auth()
    const user = session?.user

    return (
        <header
            className="sticky top-0 z-40 w-full"
            style={{
                // Fondo semitransparente sobre zinc-950 — invisible cuando no hay scroll,
                // sutil cuando hay contenido debajo. Sin border visible en hero.
                background: "rgba(9, 9, 11, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(39, 39, 42, 0.6)",
            }}
        >
            <nav
                className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4"
                role="navigation"
                aria-label="Navegación principal"
            >

                {/* Logo */}
                <Link
                    href="/"
                    className="font-heading text-xl text-white tracking-wide leading-none
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4
                               focus-visible:outline-white rounded-sm"
                >
                    PRODE
                    <span style={{ color: "#fe3d12" }}>·</span>
                    MUNDIAL
                </Link>

                {/* Acciones */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Link de ligas — acceso rápido sin abrir dropdown */}
                            {/* <Link
                                href="/leagues"
                                className="hidden sm:block font-sans text-xs text-zinc-500 hover:text-white
                                           transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-zinc-800/60
                                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                           focus-visible:outline-white"
                            >
                                Mis ligas
                            </Link> */}
                            <UserMenu user={user} />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="font-sans text-sm font-medium text-zinc-400 hover:text-white
                                       transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-zinc-800/60
                                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                       focus-visible:outline-white"
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </div>

            </nav>
        </header>
    )
}