/**
 * prisma/seed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seed profesional para el Prode Mundial 2026.
 *
 * Características:
 *  • Carga los 48 equipos con código FIFA, grupo y URL de bandera.
 *  • Carga los 104 partidos completos (72 grupos + 32 eliminatorias).
 *  • Fase de grupos: homeTeamId/awayTeamId resueltos desde el JSON.
 *  • Fase eliminatoria: IDs null, placeholders en texto, bracket linkado.
 *  • Todas las fechas en UTC (Argentina = UTC-3, sin conversión en DB).
 *  • predictionsDeadline = matchDate - 1 hora (configurable por constante).
 *  • Idempotente: upsert en vez de create para re-runs seguros.
 *
 * Uso:
 *   npx prisma db seed
 *   (o) tsx prisma/seed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { PrismaClient, MatchStage, MatchStatus } from '@prisma/client'
import fixtureData from '../world-cup-2026.json'

const prisma = new PrismaClient()

// ── Config ────────────────────────────────────────────────────────────────────
/** Cuántos minutos antes del partido cierran las predicciones */
const PREDICTIONS_CLOSE_BEFORE_MINUTES = 60

// ── Types ─────────────────────────────────────────────────────────────────────
type RawMatch = (typeof fixtureData.matches)[number]
type RawTeam = (typeof fixtureData.teams)[number]

// ── Helpers ───────────────────────────────────────────────────────────────────
function deadline(matchDate: Date): Date {
    return new Date(matchDate.getTime() - PREDICTIONS_CLOSE_BEFORE_MINUTES * 60 * 1000)
}

function stageFromString(s: string): MatchStage {
    const map: Record<string, MatchStage> = {
        GROUP: MatchStage.GROUP,
        ROUND_OF_32: MatchStage.ROUND_OF_32,
        ROUND_OF_16: MatchStage.ROUND_OF_16,
        QUARTER_FINAL: MatchStage.QUARTER_FINAL,
        SEMI_FINAL: MatchStage.SEMI_FINAL,
        THIRD_PLACE: MatchStage.THIRD_PLACE,
        FINAL: MatchStage.FINAL,
    }
    if (!map[s]) throw new Error(`Unknown stage: ${s}`)
    return map[s]
}

// ── Seed ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🌍  Iniciando seed del Mundial 2026...\n')

    // ── 1. Equipos ──────────────────────────────────────────────────────────────
    console.log('📋  Cargando 48 equipos...')
    const teamMap = new Map<string, string>() // code → id

    for (const t of fixtureData.teams as RawTeam[]) {
        const team = await prisma.team.upsert({
            where: { code: t.code },
            update: { name: t.name, group: t.group ?? null, flagUrl: t.flagUrl ?? null },
            create: { code: t.code, name: t.name, group: t.group ?? null, flagUrl: t.flagUrl ?? null },
        })
        teamMap.set(t.code, team.id)
        process.stdout.write('.')
    }
    console.log(`\n✅  ${teamMap.size} equipos cargados.\n`)

    // ── 2. Partidos ─────────────────────────────────────────────────────────────
    console.log('⚽  Cargando 104 partidos...')

    // Primera pasada: crear/actualizar todos los partidos.
    // Los knockout empiezan sin homeTeamId/awayTeamId (null).
    // Los IDs de DB se guardan para la segunda pasada (bracket linking).
    const matchDbIds = new Map<number, string>() // matchNumber → DB id

    for (const m of fixtureData.matches as RawMatch[]) {
        // Ignorar la propiedad _comment / _note que no son datos
        if (!m.matchNumber) continue

        const matchDate = new Date(m.matchDate as string)
        const predictionsDeadline = deadline(matchDate)
        const stage = stageFromString(m.stage as string)

        const homeTeamId = m.homeTeam ? (teamMap.get(m.homeTeam as string) ?? null) : null
        const awayTeamId = m.awayTeam ? (teamMap.get(m.awayTeam as string) ?? null) : null

        const record = await prisma.match.upsert({
            where: { matchNumber: m.matchNumber },
            update: {
                homeTeamId,
                awayTeamId,
                homePlaceholder: (m.homePlaceholder as string) ?? null,
                awayPlaceholder: (m.awayPlaceholder as string) ?? null,
                venue: (m.venue as string) ?? null,
                city: (m.city as string) ?? null,
                venueTimezone: (m.venueTimezone as string) ?? null,
                matchDate,
                predictionsDeadline,
                group: (m.group as string) ?? null,
                stage,
                status: MatchStatus.SCHEDULED,
            },
            create: {
                matchNumber: m.matchNumber,
                homeTeamId,
                awayTeamId,
                homePlaceholder: (m.homePlaceholder as string) ?? null,
                awayPlaceholder: (m.awayPlaceholder as string) ?? null,
                venue: (m.venue as string) ?? null,
                city: (m.city as string) ?? null,
                venueTimezone: (m.venueTimezone as string) ?? null,
                matchDate,
                predictionsDeadline,
                group: (m.group as string) ?? null,
                stage,
                status: MatchStatus.SCHEDULED,
            },
        })

        matchDbIds.set(m.matchNumber, record.id)
        process.stdout.write('.')
    }

    console.log(`\n✅  ${matchDbIds.size} partidos cargados.\n`)

    // ── 3. Bracket linking (segunda pasada) ─────────────────────────────────────
    // Enlaza los partidos eliminatorios con los DB IDs de los partidos "fuente".
    console.log('🔗  Vinculando bracket eliminatorio...')

    for (const m of fixtureData.matches as RawMatch[]) {
        if (!m.matchNumber) continue

        const homeSourceNum = (m as any).homeSourceMatchNumber as number | undefined
        const awaySourceNum = (m as any).awaySourceMatchNumber as number | undefined

        if (!homeSourceNum && !awaySourceNum) continue

        await prisma.match.update({
            where: { matchNumber: m.matchNumber },
            data: {
                homeSourceMatchId: homeSourceNum ? (matchDbIds.get(homeSourceNum) ?? null) : null,
                awaySourceMatchId: awaySourceNum ? (matchDbIds.get(awaySourceNum) ?? null) : null,
            },
        })
        process.stdout.write('.')
    }

    console.log('\n✅  Bracket vinculado.\n')

    // ── 4. Resumen ───────────────────────────────────────────────────────────────
    const groupCount = (fixtureData.matches as RawMatch[]).filter(m => m.stage === 'GROUP').length
    const knockoutCount = (fixtureData.matches as RawMatch[]).filter(m => m.stage !== 'GROUP' && m.matchNumber).length

    console.log('─'.repeat(50))
    console.log('📊  RESUMEN DEL SEED:')
    console.log(`    Equipos cargados:       ${teamMap.size} / 48`)
    console.log(`    Partidos de grupos:     ${groupCount} / 72`)
    console.log(`    Partidos eliminatorios: ${knockoutCount} / 32`)
    console.log(`    Total partidos:         ${matchDbIds.size} / 104`)
    console.log('─'.repeat(50))
    console.log('✅  Seed completado exitosamente.')
    console.log('💡  Timezone de Argentina: UTC-3')
    console.log('    Todas las fechas están en UTC en la DB.')
    console.log('    Para mostrar en AR: new Date(match.matchDate).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })')
}

main()
    .catch((e) => {
        console.error('❌  Error en el seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })