import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Payment } from "mercadopago"
import client from "@/lib/mercadopago"

export async function POST(request) {
    try {
        const body = await request.json()

        // MP manda distintos tipos de notificaciones, solo nos interesa "payment"
        if (body.type !== "payment") {
            return NextResponse.json({ received: true })
        }

        const mpPaymentId = body.data?.id
        if (!mpPaymentId) {
            return NextResponse.json({ received: true })
        }

        // Consultamos el pago directamente a la API de MP para verificarlo
        // Nunca confiamos solo en lo que nos manda el webhook
        const paymentApi = new Payment(client)
        const mpPayment = await paymentApi.get({ id: mpPaymentId })

        if (!mpPayment) {
            return NextResponse.json({ received: true })
        }

        const externalReference = mpPayment.external_reference
        const status = mpPayment.status

        if (!externalReference) {
            return NextResponse.json({ received: true })
        }

        // Buscar el pago en nuestra DB por external_reference (que es nuestro payment.id)
        const payment = await prisma.payment.findFirst({
            where: { id: externalReference },
            include: { user: true },
        })

        if (!payment) {
            return NextResponse.json({ received: true })
        }

        if (status === "approved") {
            // Actualizar payment en nuestra DB
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "APPROVED",
                    mpPaymentId: mpPaymentId.toString(),
                },
            })

            // Marcar usuario como pagado
            await prisma.user.update({
                where: { id: payment.userId },
                data: { hasPaid: true },
            })

            // Agregar a la liga general si no está ya
            const generalLeague = await prisma.league.findFirst({
                where: { type: "GENERAL_PAID" },
            })

            if (generalLeague) {
                await prisma.leagueMember.upsert({
                    where: {
                        leagueId_userId: {
                            leagueId: generalLeague.id,
                            userId: payment.userId,
                        },
                    },
                    update: {},
                    create: {
                        leagueId: generalLeague.id,
                        userId: payment.userId,
                    },
                })
            }
        } else if (status === "rejected") {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "REJECTED",
                    mpPaymentId: mpPaymentId.toString(),
                },
            })
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Error en webhook MP:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}