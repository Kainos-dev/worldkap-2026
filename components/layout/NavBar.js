import { auth } from "@/lib/auth"
import UserMenu from "@/components/auth/UserMenu"
import Link from "next/link"

export default async function Navbar() {
    const session = await auth()

    return (
        <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">

            <Link href="/" className="font-bebas text-2xl text-white tracking-widest">
                PRODE MUNDIAL
            </Link>

            <div className="flex items-center gap-4">
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : (
                    <Link
                        href="/login"
                        className="font-inter text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        Iniciar sesión
                    </Link>
                )}
            </div>

        </nav>
    )
}