"use client"
import { useState } from "react"

export default function JoinGeneralButton() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleClick() {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/checkout", { method: "POST" })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                setError(data.error || "Ocurrió un error")
            }
        } catch {
            setError("Ocurrió un error, intentá de nuevo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleClick}
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-100 disabled:opacity-50 text-zinc-900 font-inter font-semibold text-sm py-3 rounded-xl transition-colors"
            >
                {loading ? "Redirigiendo..." : "Pagar $5.000 con Mercado Pago"}
            </button>
            {error && (
                <p className="font-inter text-xs text-red-400 text-center">{error}</p>
            )}
        </div>
    )
}