import Link from "next/link"

export default function PaymentFailure() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-red-500/30 rounded-2xl p-8 flex flex-col gap-6 text-center">
                <span className="text-4xl">❌</span>
                <div>
                    <h1 className="font-bebas text-3xl text-white">PAGO RECHAZADO</h1>
                    <p className="font-inter text-sm text-zinc-400 mt-2">
                        Hubo un problema con tu pago. Podés intentarlo de nuevo.
                    </p>
                </div>
                <Link href="/leagues/join-general" className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors">
                    Intentar de nuevo
                </Link>
            </div>
        </main>
    )
}