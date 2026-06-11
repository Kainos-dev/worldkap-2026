import Link from "next/link"

export default function PaymentFailurePage() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-3xl">
                    ✕
                </div>
                <div>
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        PAGO RECHAZADO
                    </h1>
                    <p className="font-inter text-zinc-400 text-sm mt-2">
                        No se pudo procesar el pago. Podés intentarlo de nuevo.
                    </p>
                </div>
                <Link
                    href="/leagues/join-general"
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold py-3 rounded-xl transition-colors text-center"
                >
                    Intentar de nuevo
                </Link>
                <Link
                    href="/leagues"
                    className="text-zinc-500 hover:text-white font-inter text-sm transition-colors"
                >
                    Volver a mis ligas
                </Link>
            </div>
        </main>
    )
}