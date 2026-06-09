import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import JoinGeneralButton from "@/components/leagues/JoinGeneralButton"

export default async function JoinGeneralPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")
    if (session.user.hasPaid) redirect("/leagues")

    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <span className="font-inter text-xs text-zinc-500 tracking-widest uppercase">
                        Liga General
                    </span>
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        MUNDIAL 2026
                    </h1>
                </div>

                <div className="flex flex-col gap-3 bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex justify-between">
                        <span className="font-inter text-sm text-zinc-400">Entrada</span>
                        <span className="font-bebas text-2xl text-white">$5.000</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-inter text-sm text-zinc-400">Medio de pago</span>
                        <span className="font-inter text-sm text-white">Mercado Pago</span>
                    </div>
                </div>

                <p className="font-inter text-xs text-zinc-500 leading-relaxed">
                    Vas a ser redirigido a Mercado Pago para completar el pago de forma segura.
                    Una vez aprobado, quedás automáticamente inscripto en la liga.
                </p>

                <JoinGeneralButton />
            </div>
        </main>
    )
}