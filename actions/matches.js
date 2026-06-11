"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }
    return session
}

export async function updateMatchResult(matchId, homeScore, awayScore) {
    await requireAdmin()

    await prisma.match.update({
        where: { id: matchId },
        data: {
            homeScore: parseInt(homeScore),
            awayScore: parseInt(awayScore),
            status: "FINISHED",
        },
    })

    // Calcular puntos de todas las predicciones de este partido
    await calculatePredictionPoints(matchId, parseInt(homeScore), parseInt(awayScore))

    revalidatePath("/admin/matches")
    revalidatePath("/leagues")
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

// Se llama automáticamente al cargar resultado
async function calculatePredictionPoints(matchId, realHome, realAway) {
    const predictions = await prisma.prediction.findMany({
        where: { matchId, scored: false },
    })

    const realResult = getResult(realHome, realAway)

    for (const prediction of predictions) {
        const predResult = getResult(prediction.homeGoals, prediction.awayGoals)
        let points = 0

        if (
            prediction.homeGoals === realHome &&
            prediction.awayGoals === realAway
        ) {
            points = 3 // Exacto
        } else if (predResult === realResult) {
            points = 1 // Resultado correcto, marcador incorrecto
        }

        await prisma.prediction.update({
            where: { id: prediction.id },
            data: { points, scored: true },
        })
    }
}

function getResult(home, away) {
    if (home > away) return "HOME"
    if (away > home) return "AWAY"
    return "DRAW"
}