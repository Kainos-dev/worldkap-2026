import { prisma } from "@/lib/prisma"
import AdminUsersTable from "./AdminUsersTable"

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    predictions: true,
                    leagueMembers: true,
                },
            },
        },
    })

    const totalPaid = users.filter((u) => u.hasPaid).length

    return (
        <div className="flex flex-col gap-8">

            <div className="flex flex-col gap-1">
                <h1 className="font-bebas text-4xl text-white tracking-wide">
                    USUARIOS
                </h1>
                <p className="font-inter text-zinc-500 text-sm">
                    {users.length} registrados · {totalPaid} pagaron la liga general
                </p>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="font-inter text-xs text-zinc-500">Total usuarios</p>
                    <p className="font-bebas text-4xl text-white mt-1">{users.length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="font-inter text-xs text-zinc-500">En liga general</p>
                    <p className="font-bebas text-4xl text-yellow-400 mt-1">{totalPaid}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="font-inter text-xs text-zinc-500">Pozo acumulado</p>
                    <p className="font-bebas text-4xl text-white mt-1">
                        ${(totalPaid * 5000).toLocaleString("es-AR")}
                    </p>
                </div>
            </div>

            <AdminUsersTable users={users} />

        </div>
    )
}