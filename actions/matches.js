"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Verificación de admin reutilizable
async function requireAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }
    return session
}

export async function createMatch(formData) {
    await requireAdmin()

    const homeTeam = formData.get("homeTeam")
    const awayTeam = formData.get("awayTeam")
    const matchDate = formData.get("matchDate")
    const matchTime = formData.get("matchTime")
    const group = formData.get("group")
    const stage = formData.get("stage")

    if (!homeTeam || !awayTeam || !matchDate || !matchTime) {
        return { error: "Todos los campos son obligatorios" }
    }

    // Combinamos fecha y hora en un solo DateTime
    const fullDate = new Date(`${matchDate}T${matchTime}:00`)

    await prisma.match.create({
        data: {
            homeTeam,
            awayTeam,
            matchDate: fullDate,
            group: group || null,
            stage: stage || "GROUP",
            status: "SCHEDULED",
            predictionsOpen: true,
        },
    })

    revalidatePath("/admin/matches")
    return { success: true }
}

export async function updateMatchResult(matchId, homeScore, awayScore) {
    await requireAdmin()

    await prisma.match.update({
        where: { id: matchId },
        data: {
            homeScore: parseInt(homeScore),
            awayScore: parseInt(awayScore),
            status: "FINISHED",
            predictionsOpen: false,
        },
    })

    revalidatePath("/admin/matches")
    return { success: true }
}

export async function updateMatchStatus(matchId, status) {
    await requireAdmin()

    await prisma.match.update({
        where: { id: matchId },
        data: { status },
    })

    revalidatePath("/admin/matches")
    return { success: true }
}

export async function deleteMatch(matchId) {
    await requireAdmin()

    await prisma.match.delete({
        where: { id: matchId },
    })

    revalidatePath("/admin/matches")
    return { success: true }
}

export async function togglePredictions(matchId, open) {
    await requireAdmin()

    await prisma.match.update({
        where: { id: matchId },
        data: { predictionsOpen: open },
    })

    revalidatePath("/admin/matches")
    return { success: true }
}