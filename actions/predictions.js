"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function savePrediction(matchId, homeGoals, awayGoals) {
    const session = await auth()
    if (!session?.user) throw new Error("No autorizado")

    const userId = session.user.id

    // Verificar que el partido existe y acepta predicciones
    const match = await prisma.match.findUnique({
        where: { id: matchId },
    })

    if (!match) return { error: "Partido no encontrado" }
    if (match.status !== "SCHEDULED") return { error: "El partido ya comenzó" }

    const now = new Date()
    if (now >= new Date(match.predictionsDeadline)) {
        return { error: "Las predicciones para este partido están cerradas" }
    }

    // Upsert: crea si no existe, actualiza si ya existe
    await prisma.prediction.upsert({
        where: {
            userId_matchId: { userId, matchId },
        },
        update: {
            homeGoals: parseInt(homeGoals),
            awayGoals: parseInt(awayGoals),
        },
        create: {
            userId,
            matchId,
            homeGoals: parseInt(homeGoals),
            awayGoals: parseInt(awayGoals),
        },
    })

    revalidatePath(`/leagues`)
    return { success: true }
}