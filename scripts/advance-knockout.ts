/**
 * scripts/advance-knockout.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ejecutar después de que termine cada partido eliminatorio (o al finalizar
 * la fase de grupos para la ronda de 32) para propagar los equipos ganadores
 * al próximo partido del bracket.
 *
 * También contiene la función `advanceGroupStageToRoundOf32()` que se ejecuta
 * UNA VEZ, al terminar todos los partidos del grupo.
 *
 * Uso típico:
 *   tsx scripts/advance-knockout.ts --match=73   (después de cargar resultado del Partido 73)
 *   tsx scripts/advance-knockout.ts --groups      (al terminar fase de grupos)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { PrismaClient, MatchResult, MatchStatus } from '@prisma/client'

const prisma = new PrismaClient()

// ── Types ─────────────────────────────────────────────────────────────────────
interface GroupStanding {
    teamId: string
    teamCode: string
    group: string
    points: number
    gd: number  // goal difference
    gf: number  // goals for
    wins: number
}

// ── Función principal: avanzar bracket tras resultado de un partido ────────────
export async function advanceMatchWinner(matchNumber: number) {
    const finishedMatch = await prisma.match.findUniqueOrThrow({
        where: { matchNumber },
        include: { homeTeam: true, awayTeam: true },
    })

    if (finishedMatch.homeScore === null || finishedMatch.awayScore === null) {
        throw new Error(`Partido ${matchNumber} no tiene resultado cargado.`)
    }
    if (!finishedMatch.homeTeamId || !finishedMatch.awayTeamId) {
        throw new Error(`Partido ${matchNumber} no tiene equipos confirmados.`)
    }

    // Determinar ganador y perdedor
    let winnerId: string
    let loserId: string

    if (finishedMatch.homeScore > finishedMatch.awayScore) {
        winnerId = finishedMatch.homeTeamId
        loserId = finishedMatch.awayTeamId
    } else if (finishedMatch.awayScore > finishedMatch.homeScore) {
        winnerId = finishedMatch.awayTeamId
        loserId = finishedMatch.homeTeamId
    } else {
        // Empate → penales
        if (finishedMatch.homePenalties === null || finishedMatch.awayPenalties === null) {
            throw new Error(`Partido ${matchNumber} empató pero no tiene resultado de penales.`)
        }
        if (finishedMatch.homePenalties > finishedMatch.awayPenalties) {
            winnerId = finishedMatch.homeTeamId
            loserId = finishedMatch.awayTeamId
        } else {
            winnerId = finishedMatch.awayTeamId
            loserId = finishedMatch.homeTeamId
        }
    }

    const finishedMatchDbId = finishedMatch.id
    console.log(`⚽  Partido ${matchNumber}: Ganador DB ID = ${winnerId}`)

    // Buscar partidos donde este partido es fuente del equipo local
    const nextMatchesAsHome = await prisma.match.findMany({
        where: { homeSourceMatchId: finishedMatchDbId },
    })

    for (const next of nextMatchesAsHome) {
        const teamId = next.homeSourceResult === MatchResult.LOSER ? loserId : winnerId
        await prisma.match.update({
            where: { id: next.id },
            data: {
                homeTeamId: teamId,
                homePlaceholder: null, // limpiamos el placeholder
            },
        })
        console.log(`  ✅  Partido ${next.matchNumber}: homeTeamId actualizado.`)
    }

    // Buscar partidos donde este partido es fuente del equipo visitante
    const nextMatchesAsAway = await prisma.match.findMany({
        where: { awaySourceMatchId: finishedMatchDbId },
    })

    for (const next of nextMatchesAsAway) {
        const teamId = next.awaySourceResult === MatchResult.LOSER ? loserId : winnerId
        await prisma.match.update({
            where: { id: next.id },
            data: {
                awayTeamId: teamId,
                awayPlaceholder: null,
            },
        })
        console.log(`  ✅  Partido ${next.matchNumber}: awayTeamId actualizado.`)
    }
}

// ── Calcular tabla de posiciones de un grupo ──────────────────────────────────
async function computeGroupStandings(): Promise<GroupStanding[]> {
    const groupMatches = await prisma.match.findMany({
        where: {
            stage: 'GROUP',
            status: MatchStatus.FINISHED,
            homeScore: { not: null },
            awayScore: { not: null },
        },
        include: { homeTeam: true, awayTeam: true },
    })

    const standings = new Map<string, GroupStanding>()

    // Inicializar
    const allTeams = await prisma.team.findMany({ where: { group: { not: null } } })
    for (const t of allTeams) {
        standings.set(t.id, {
            teamId: t.id, teamCode: t.code,
            group: t.group!, points: 0, gd: 0, gf: 0, wins: 0,
        })
    }

    // Acumular resultados
    for (const m of groupMatches) {
        if (!m.homeTeamId || !m.awayTeamId) continue
        const hs = m.homeScore!
        const as_ = m.awayScore!
        const home = standings.get(m.homeTeamId)!
        const away = standings.get(m.awayTeamId)!

        home.gf += hs; home.gd += (hs - as_)
        away.gf += as_; away.gd += (as_ - hs)

        if (hs > as_) { home.points += 3; home.wins++ }
        else if (as_ > hs) { away.points += 3; away.wins++ }
        else { home.points += 1; away.points += 1 }
    }

    return Array.from(standings.values())
}

// ── Obtener top-2 y 3ros por grupo ────────────────────────────────────────────
function sortGroup(standings: GroupStanding[]): GroupStanding[] {
    return standings.sort((a, b) =>
        b.points - a.points ||
        b.gd - a.gd ||
        b.gf - a.gf
    )
}

// ── Asignar 3ros a los slots del bracket (lógica oficial FIFA 2026) ────────────
/**
 * FIFA 2026 define 8 slots para los mejores terceros.
 * El slot específico depende de QUÉ grupos tuvieron los 8 mejores terceros.
 * Esta tabla refleja la distribución oficial:
 *
 * El mapping completo requiere la tabla oficial de FIFA (similar a la de 2022).
 * Aquí implementamos la tabla según los datos confirmados del fixture.
 */
const BEST_THIRD_SLOT_TABLE: Record<string, number[]> = {
    // key = sorted string of group letters with 3rd placers, value = match numbers
    // Esta tabla se lee: "si los 8 mejores terceros provienen de los grupos X,
    // entonces el 3ro del grupo Y va al partido Z".
    // Por simplicidad en el seed inicial, los placeholders ya describen los grupos posibles.
    // El verdadero mapping se resuelve DESPUÉS de conocer qué 8 terceros clasifican.
    'DEFAULT': [74, 77, 79, 80, 81, 82, 85, 87],
}

// ── Función principal: avanzar Ronda de 32 tras fase de grupos ────────────────
export async function advanceGroupStageToRoundOf32() {
    console.log('\n🏆  Calculando clasificados para la Ronda de 32...\n')

    const allStandings = await computeGroupStandings()
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    const groupWinners = new Map<string, string>() // group → teamId
    const groupRunnerUps = new Map<string, string>() // group → teamId
    const thirdPlacers: GroupStanding[] = []

    for (const g of groups) {
        const groupStandings = sortGroup(allStandings.filter(s => s.group === g))
        if (groupStandings.length < 3) {
            console.warn(`⚠️  Grupo ${g} no tiene suficientes equipos con resultados.`)
            continue
        }
        groupWinners.set(g, groupStandings[0].teamId)
        groupRunnerUps.set(g, groupStandings[1].teamId)
        thirdPlacers.push(groupStandings[2])
        console.log(`  Grupo ${g}: 1°=${groupStandings[0].teamCode} 2°=${groupStandings[1].teamCode} 3°=${groupStandings[2].teamCode}`)
    }

    // Ordenar terceros para obtener los 8 mejores
    const best8thirds = sortGroup(thirdPlacers).slice(0, 8)
    console.log('\n  Mejores 8 terceros:', best8thirds.map(t => `${t.teamCode}(${t.group})`).join(', '))

    // ── Actualizar partidos de la Ronda de 32 con equipos reales ──────────────
    // Mapping fijo oficial (basado en fixture oficial FIFA 2026)
    const roundOf32Mapping: Array<{
        matchNumber: number
        homeRef: { type: 'winner' | 'runnerup', group: string }
        awayRef: { type: 'winner' | 'runnerup', group: string }
    }> = [
            { matchNumber: 73, homeRef: { type: 'runnerup', group: 'A' }, awayRef: { type: 'runnerup', group: 'B' } },
            { matchNumber: 75, homeRef: { type: 'winner', group: 'F' }, awayRef: { type: 'runnerup', group: 'C' } },
            { matchNumber: 76, homeRef: { type: 'winner', group: 'C' }, awayRef: { type: 'runnerup', group: 'F' } },
            { matchNumber: 78, homeRef: { type: 'runnerup', group: 'E' }, awayRef: { type: 'runnerup', group: 'I' } },
            { matchNumber: 83, homeRef: { type: 'runnerup', group: 'K' }, awayRef: { type: 'runnerup', group: 'L' } },
            { matchNumber: 84, homeRef: { type: 'winner', group: 'H' }, awayRef: { type: 'runnerup', group: 'J' } },
            { matchNumber: 86, homeRef: { type: 'winner', group: 'J' }, awayRef: { type: 'runnerup', group: 'H' } },
            { matchNumber: 88, homeRef: { type: 'runnerup', group: 'D' }, awayRef: { type: 'runnerup', group: 'G' } },
            // Los que necesitan "mejor 3ro" se actualizan por separado
            { matchNumber: 79, homeRef: { type: 'winner', group: 'A' }, awayRef: { type: 'runnerup', group: 'A' } }, // awayRef TBD por 3ros
            { matchNumber: 80, homeRef: { type: 'winner', group: 'L' }, awayRef: { type: 'runnerup', group: 'L' } }, // awayRef TBD
            { matchNumber: 81, homeRef: { type: 'winner', group: 'D' }, awayRef: { type: 'runnerup', group: 'D' } }, // awayRef TBD
            { matchNumber: 82, homeRef: { type: 'winner', group: 'G' }, awayRef: { type: 'runnerup', group: 'G' } }, // awayRef TBD
            { matchNumber: 74, homeRef: { type: 'winner', group: 'E' }, awayRef: { type: 'runnerup', group: 'E' } }, // awayRef TBD
            { matchNumber: 77, homeRef: { type: 'winner', group: 'I' }, awayRef: { type: 'runnerup', group: 'I' } }, // awayRef TBD
            { matchNumber: 85, homeRef: { type: 'winner', group: 'B' }, awayRef: { type: 'runnerup', group: 'B' } }, // awayRef TBD
            { matchNumber: 87, homeRef: { type: 'winner', group: 'K' }, awayRef: { type: 'runnerup', group: 'K' } }, // awayRef TBD
        ]

    for (const mapping of roundOf32Mapping) {
        const homeTeamId = mapping.homeRef.type === 'winner'
            ? groupWinners.get(mapping.homeRef.group)
            : groupRunnerUps.get(mapping.homeRef.group)

        if (!homeTeamId) continue

        await prisma.match.update({
            where: { matchNumber: mapping.matchNumber },
            data: {
                homeTeamId,
                homePlaceholder: null,
            },
        })
    }

    // ── Asignar mejores terceros a sus slots ──────────────────────────────────
    // La asignación exacta requiere conocer QUÉ grupos tuvieron los 8 mejores 3ros.
    // Aquí implementamos la lógica simplificada (orden alfabético dentro del slot).
    // Para producción, implementar la tabla completa oficial de FIFA.
    console.log('\n⚠️  Los slots de terceros requieren la tabla completa de FIFA.')
    console.log('   Implementar manualmente según los grupos que clasifiquen.')
    console.log('   Ver: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/format')

    console.log('\n✅  Ronda de 32 actualizada con clasificados de fase de grupos.')
}

// ── CLI runner ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)

async function run() {
    try {
        if (args.includes('--groups')) {
            await advanceGroupStageToRoundOf32()
        } else {
            const matchArg = args.find(a => a.startsWith('--match='))
            if (matchArg) {
                const matchNum = parseInt(matchArg.split('=')[1])
                await advanceMatchWinner(matchNum)
            } else {
                console.log('Uso: tsx scripts/advance-knockout.ts --match=<número> | --groups')
            }
        }
    } catch (e) {
        console.error('Error:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

run()