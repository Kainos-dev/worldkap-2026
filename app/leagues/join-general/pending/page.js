import Link from "next/link"

export default function PaymentPendingPage() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-3xl">
                    ⏳
                </div>
                <div>
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        PAGO PENDIENTE
                    </h1>
                    <p className="font-inter text-zinc-400 text-sm mt-2">
                        Tu pago está siendo procesado. Te avisaremos cuando se confirme.
                        Puede tardar unos minutos.
                    </p>
                </div>
                <Link
                    href="/leagues"
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold py-3 rounded-xl transition-colors text-center"
                >
                    Volver a mis ligas
                </Link>
            </div>
        </main>
    )
}