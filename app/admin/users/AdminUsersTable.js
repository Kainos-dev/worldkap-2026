"use client"

import { useState } from "react"
import Image from "next/image"

export default function AdminUsersTable({ users }) {
    const [search, setSearch] = useState("")

    const filtered = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-4">

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-inter text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 w-full max-w-sm"
            />

            {/* Tabla */}
            <div className="flex flex-col gap-2">
                {filtered.map((user) => (
                    <div
                        key={user.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name ?? ""}
                                width={36}
                                height={36}
                                className="rounded-full shrink-0"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                                <span className="font-inter text-sm text-white">
                                    {user.name?.charAt(0).toUpperCase() ?? "?"}
                                </span>
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="font-inter font-medium text-white text-sm truncate">
                                {user.name ?? "Sin nombre"}
                            </span>
                            <span className="font-inter text-zinc-500 text-xs truncate">
                                {user.email}
                            </span>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 shrink-0">
                            {user.role === "ADMIN" && (
                                <span className="font-inter text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                    Admin
                                </span>
                            )}
                            {user.hasPaid ? (
                                <span className="font-inter text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                    Pagó
                                </span>
                            ) : (
                                <span className="font-inter text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
                                    Free
                                </span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 shrink-0 hidden md:flex">
                            <div className="text-right">
                                <p className="font-inter text-xs text-zinc-600">Pronósticos</p>
                                <p className="font-bebas text-lg text-white">
                                    {user._count.predictions}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-inter text-xs text-zinc-600">Ligas</p>
                                <p className="font-bebas text-lg text-white">
                                    {user._count.leagueMembers}
                                </p>
                            </div>
                        </div>

                        {/* Fecha */}
                        <span className="font-inter text-xs text-zinc-600 shrink-0 hidden lg:block">
                            {new Date(user.createdAt).toLocaleDateString("es-AR")}
                        </span>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-8">
                        <p className="font-inter text-zinc-500 text-sm">
                            No se encontraron usuarios
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}