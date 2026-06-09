import Link from "next/link"

export default function PaymentPending() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-yellow-500/30 rounded-2xl p-8 flex flex-col gap-6 text-center">
                <span className="text-4xl">⏳</span>
                <div>
                    <h1 className="font-bebas text-3xl text-white">PAGO PENDIENTE</h1>
                    <p className="font-inter text-sm text-zinc-400 mt-2">
                        Tu pago está siendo procesado. Te avisamos cuando se confirme.
                    </p>
                </div>
                <Link href="/leagues" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-inter font-semibold text-sm py-3 rounded-xl transition-colors">
                    Volver a mis ligas
                </Link>
            </div>
        </main>
    )
}