import Link from "next/link"

export default function PaymentSuccess() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-green-500/30 rounded-2xl p-8 flex flex-col gap-6 text-center">
                <span className="text-4xl">🎉</span>
                <div>
                    <h1 className="font-bebas text-3xl text-white">¡PAGO APROBADO!</h1>
                    <p className="font-inter text-sm text-zinc-400 mt-2">
                        Ya sos parte de la Liga General del Mundial 2026.
                    </p>
                </div>
                <Link href="/leagues" className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors">
                    Ver mi liga →
                </Link>
            </div>
        </main>
    )
}