"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ENTRY_AMOUNT = 5000

export default function JoinGeneralPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handlePay() {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/payments/create", {
                method: "POST",
            })

            const data = await res.json()

            if (data.error) {
                setError(data.error)
                setLoading(false)
                return
            }

            // Redirigir a MP
            window.location.href = data.url
        } catch {
            setError("Ocurrió un error. Intentá de nuevo.")
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md flex flex-col gap-6">

                <div>
                    <h1 className="font-bebas text-4xl text-white tracking-wide">
                        LIGA GENERAL 2026
                    </h1>
                    <p className="font-inter text-zinc-400 text-sm mt-1">
                        Confirmá tu entrada antes de pagar
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">

                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                        <span className="font-inter text-sm text-zinc-400">Concepto</span>
                        <span className="font-inter text-sm text-white">
                            Entrada Liga General
                        </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                        <span className="font-inter text-sm text-zinc-400">Monto</span>
                        <span className="font-bebas text-3xl text-white">
                            ${ENTRY_AMOUNT.toLocaleString("es-AR")}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xs">✓</span>
                            <span className="font-inter text-xs text-zinc-400">
                                Pago único, sin cargos adicionales
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xs">✓</span>
                            <span className="font-inter text-xs text-zinc-400">
                                Acceso inmediato al ranking general
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xs">✓</span>
                            <span className="font-inter text-xs text-zinc-400">
                                Top 3 se reparte el pozo: 50% / 30% / 20%
                            </span>
                        </div>
                    </div>

                </div>

                {error && (
                    <p className="font-inter text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl">
                        {error}
                    </p>
                )}

                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-inter font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Redirigiendo a Mercado Pago..." : `Pagar $${ENTRY_AMOUNT.toLocaleString("es-AR")}`}
                </button>

                <button
                    onClick={() => router.push("/leagues")}
                    className="w-full text-zinc-500 hover:text-white font-inter text-sm py-2 transition-colors cursor-pointer"
                >
                    Cancelar
                </button>

            </div>
        </main>
    )
}