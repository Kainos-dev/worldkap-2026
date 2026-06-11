"use client"

import { useState } from "react"

export default function CopyCodeButton({ code }) {
    const [copied, setCopied] = useState(false)

    function handleCopy() {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            aria-label={copied ? "Código copiado" : `Copiar código de invitación: ${code}`}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-800
                       hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800
                       transition-all duration-150 cursor-pointer
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
            <span className="font-sans font-mono text-[11px] text-zinc-500 tracking-wider">
                {code}
            </span>

            {copied ? (
                /* Check icon */
                <svg
                    aria-hidden="true"
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{ color: "#fe3d12" }}
                >
                    <path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                /* Copy icon */
                <svg
                    aria-hidden="true"
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-zinc-700"
                >
                    <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3 8H2C1.45 8 1 7.55 1 7V2C1 1.45 1.45 1 2 1H7C7.55 1 8 1.45 8 2V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            )}
        </button>
    )
}