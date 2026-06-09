import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata = {
    title: "Admin — Prode Mundial",
}

export default async function AdminLayout({ children }) {
    const session = await auth()

    // Doble verificación en el servidor (no confiar solo en el middleware)
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <span className="font-bebas text-xl text-white tracking-widest">
                        PANEL ADMIN
                    </span>
                </div>

                <nav className="flex flex-col gap-1 p-4 flex-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-inter text-sm"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/matches"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-inter text-sm"
                    >
                        Partidos
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-inter text-sm"
                    >
                        Usuarios
                    </Link>
                </nav>
            </aside>

            {/* Contenido */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>

        </div>
    )
}