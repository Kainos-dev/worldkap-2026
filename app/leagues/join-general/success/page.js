import Link from "next/link"

export default function PaymentSuccessPage() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-sans">
            <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center text-3xl">
                    🎉
                </div>
                <div>
                    <h1 className="font-heading text-4xl text-white tracking-wide">
                        PAGO CONFIRMADO
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2">
                        Ya sos parte de la Liga General 2026. Empezá a predecir.
                    </p>
                </div>
                <Link
                    href="/leagues"
                    className="w-full bg-[#fe3d12] hover:bg-zinc-100 text-zinc-900 font-semibold py-3 rounded-xl transition-colors text-center"
                >
                    Ver mis ligas
                </Link>
            </div>
        </main>
    )
}