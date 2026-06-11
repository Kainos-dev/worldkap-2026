"use client"

import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

const BRAND = "#fe3d12"

function Avatar({ user, size = 36 }) {
    if (user.image) {
        return (
            <Image
                src={user.image}
                alt={user.name ?? "Usuario"}
                width={size}
                height={size}
                className="rounded-full object-cover"
            />
        )
    }
    return (
        <div
            className="rounded-full flex items-center justify-center font-sans font-semibold text-white flex-shrink-0"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.38,
                background: BRAND,
            }}
        >
            {user.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
    )
}

const NAV_ITEMS = [
    { href: "/profile", label: "Mi perfil", icon: "ti-user" },
    { href: "/leagues", label: "Mis ligas", icon: "ti-trophy" },
]

const ADMIN_ITEM = { href: "/admin", label: "Panel admin", icon: "ti-shield-bolt" }

export default function UserMenu({ user }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    const handleSignOut = () => signOut({ callbackUrl: "/login" })

    const isAdmin = user.role === "ADMIN"
    const navItems = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS

    return (
        <div className="relative" ref={ref}>

            {/* Botón avatar */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Menú de usuario"
                className="flex items-center rounded-full p-0.5 transition-all duration-150 cursor-pointer
                           ring-2 ring-transparent hover:ring-[#fe3d12]/60 focus-visible:ring-[#fe3d12]
                           focus-visible:outline-none"
            >
                <Avatar user={user} size={36} />
            </button>

            {/* Dropdown */}
            <div
                className={`
                    absolute right-0 mt-2 w-64 z-50 origin-top-right
                    rounded-2xl border border-zinc-800 bg-[#111111] shadow-2xl
                    transition-all duration-150 ease-out
                    ${open
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                    }
                `}
            >
                {/* Info usuario */}
                <div className="px-4 py-3.5 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <Avatar user={user} size={40} />
                        <div className="flex flex-col min-w-0">
                            <span className="font-sans font-semibold text-white text-sm truncate">
                                {user.name}
                            </span>
                            <span className="font-sans text-zinc-500 text-xs truncate">
                                {user.email}
                            </span>
                        </div>
                    </div>

                    {/* Badge de rol */}
                    <div className="mt-2.5">
                        {isAdmin ? (
                            <span className="inline-block text-[10px] font-sans font-semibold tracking-wider uppercase
                                             px-2.5 py-0.5 rounded-full
                                             bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                Administrador
                            </span>
                        ) : (
                            <span
                                className="inline-block text-[10px] font-sans font-semibold tracking-wider uppercase
                                           px-2.5 py-0.5 rounded-full border"
                                style={{
                                    background: `${BRAND}14`,
                                    color: BRAND,
                                    borderColor: `${BRAND}30`,
                                }}
                            >
                                Usuario
                            </span>
                        )}
                    </div>
                </div>

                {/* Links de navegación */}
                <nav className="py-1.5">
                    {navItems.map(({ href, label, icon }) => {
                        const isAdminLink = href === "/admin"
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`
                                    flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans
                                    transition-colors duration-100
                                    ${isAdminLink
                                        ? "text-yellow-400 hover:bg-zinc-800/60 hover:text-yellow-300"
                                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                                    }
                                `}
                            >
                                <i className={`ti ${icon} text-base`} aria-hidden="true" />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Cerrar sesión */}
                <div className="border-t border-zinc-800 py-1.5">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans
                                   text-red-400 hover:bg-zinc-800/60 hover:text-red-300
                                   transition-colors duration-100 cursor-pointer"
                    >
                        <i className="ti ti-logout text-base" aria-hidden="true" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}