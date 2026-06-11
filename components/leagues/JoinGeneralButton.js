"use client"
import { useState } from "react"

const BRAND = "#fe3d12"
const ENTRY_AMOUNT = 5000

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
                className="w-full font-sans font-bold text-sm py-3 rounded-xl transition-all duration-150
                           text-center active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
                style={{ background: BRAND, color: "#fff", outlineColor: BRAND }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = "#e03510")}
                onMouseLeave={e => (e.currentTarget.style.background = BRAND)}
            >
                {loading ? "Redirigiendo..." : `Apostar $${ENTRY_AMOUNT.toLocaleString("es-AR")} y entrar`}
            </button>
            {error && (
                <p className="font-sans text-xs text-red-400 text-center">{error}</p>
            )}
        </div>
    )
} 