"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

async function requireAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }
    return session
}

// Crear la liga general paga (se llama UNA sola vez desde el admin)
export async function createGeneralLeague() {
    const session = await requireAdmin()

    const existing = await prisma.league.findFirst({
        where: { type: "GENERAL_PAID" },
    })

    if (existing) {
        return { error: "La liga general ya existe" }
    }

    await prisma.league.create({
        data: {
            name: "Liga General 2026",
            type: "GENERAL_PAID",
            code: "GENERAL-2026",
            ownerId: session.user.id,
        },
    })

    revalidatePath("/leagues")
    return { success: true }
}

// Crear liga privada
export async function createPrivateLeague(name) {
    const session = await auth()
    if (!session?.user) throw new Error("No autorizado")

    const code = nanoid(8).toUpperCase()

    const league = await prisma.league.create({
        data: {
            name,
            type: "PRIVATE_FREE",
            code,
            ownerId: session.user.id,
        },
    })

    // El creador entra automáticamente como miembro
    await prisma.leagueMember.create({
        data: {
            leagueId: league.id,
            userId: session.user.id,
        },
    })

    revalidatePath("/leagues")
    return { success: true, code, leagueId: league.id }
}

// Unirse a liga privada por código
export async function joinPrivateLeague(code) {
    const session = await auth()
    if (!session?.user) throw new Error("No autorizado")

    const league = await prisma.league.findUnique({
        where: { code: code.toUpperCase() },
    })

    if (!league) return { error: "Código inválido" }
    if (league.type !== "PRIVATE_FREE") return { error: "Código inválido" }

    const existing = await prisma.leagueMember.findUnique({
        where: {
            leagueId_userId: {
                leagueId: league.id,
                userId: session.user.id,
            },
        },
    })

    if (existing) return { error: "Ya sos parte de esta liga" }

    await prisma.leagueMember.create({
        data: {
            leagueId: league.id,
            userId: session.user.id,
        },
    })

    revalidatePath("/leagues")
    return { success: true, leagueId: league.id }
}

// Obtener predicciones del usuario para una liga
export async function getUserPredictions(userId) {
    const predictions = await prisma.prediction.findMany({
        where: { userId },
    })

    // Devolvemos un mapa matchId → prediction para acceso rápido
    return predictions.reduce((acc, p) => {
        acc[p.matchId] = p
        return acc
    }, {})
}