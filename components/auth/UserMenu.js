"use client"

import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import Image from "next/image"

export default function UserMenu({ user }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Cierra el dropdown si hacés click afuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>

            {/* Botón del avatar */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-zinc-600 transition-all p-0.5 cursor-pointer"
            >
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name ?? "Usuario"}
                        width={36}
                        height={36}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white font-inter font-medium text-sm">
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">

                    {/* Info del usuario */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                            {user.image && (
                                <Image
                                    src={user.image}
                                    alt={user.name ?? "Usuario"}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="font-inter font-medium text-white text-sm truncate">
                                    {user.name}
                                </span>
                                <span className="font-inter text-zinc-400 text-xs truncate">
                                    {user.email}
                                </span>
                            </div>
                        </div>

                        {/* Badge de rol */}
                        <div className="mt-2">
                            <span className={`
                inline-block text-xs font-inter font-medium px-2 py-0.5 rounded-full
                ${user.role === "ADMIN"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-zinc-700 text-zinc-400"
                                }
              `}>
                                {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                        <a
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-inter text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                            Mi perfil
                        </a>
                        <a
                            href="/leagues"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-inter text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                            Mis ligas
                        </a>
                        {user.role === "ADMIN" && (
                            <a
                                href="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-inter text-zinc-400 hover:bg-zinc-800 hover:text-yellow-400 transition-colors"
                            >
                                Panel admin
                            </a>
                        )}
                    </div>

                    {/* Cerrar sesión */}
                    <div className="border-t border-zinc-800 py-1">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-inter text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            Cerrar sesión
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}