import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Payment } from "mercadopago"
import client from "@/lib/mercadopago"

export async function POST(request) {
    console.log("🔔 Webhook POST recibido")

    try {
        const body = await request.text() // cambiá request.json() por request.text()
        console.log("📦 Body raw:", body)

        await fetch("https://webhook.site/1d47dd0e-1b26-4cfd-bce0-cc3d90430a17", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                body: JSON.parse(body),
                env: {
                    hasAccessToken: !!process.env.MP_ACCESS_TOKEN,
                    tokenStart: process.env.MP_ACCESS_TOKEN?.substring(0, 10),
                    hasDB: !!process.env.DATABASE_URL,
                }
            })
        }).catch(() => { })

        const data = JSON.parse(body)
        console.log("✅ Body parseado:", data.type)

        if (body.type !== "payment") {
            console.log("⏭️ Ignorando tipo:", body.type)
            return NextResponse.json({ received: true })
        }

        const mpPaymentId = body.data?.id
        console.log("💳 Payment ID de MP:", mpPaymentId)

        if (!mpPaymentId) {
            return NextResponse.json({ received: true })
        }

        const paymentApi = new Payment(client)
        console.log("🔍 Consultando pago a MP...")

        let mpPayment
        try {
            mpPayment = await paymentApi.get({ id: mpPaymentId })
            console.log("✅ Respuesta MP:", JSON.stringify({
                id: mpPayment.id,
                status: mpPayment.status,
                external_reference: mpPayment.external_reference,
            }))
        } catch (mpError) {
            console.error("❌ Error consultando MP:", mpError)
            return NextResponse.json({ received: true })
        }

        if (!mpPayment) {
            console.log("⚠️ mpPayment vacío")
            return NextResponse.json({ received: true })
        }

        const externalReference = mpPayment.external_reference
        const status = mpPayment.status

        console.log("📋 external_reference:", externalReference)
        console.log("📋 status:", status)

        if (!externalReference) {
            console.log("⚠️ Sin external_reference")
            return NextResponse.json({ received: true })
        }

        const payment = await prisma.payment.findFirst({
            where: { id: externalReference },
            include: { user: true },
        })

        console.log("🗄️ Payment en DB:", payment ? payment.id : "NO ENCONTRADO")

        if (!payment) {
            console.log("⚠️ Pago no encontrado en DB con external_reference:", externalReference)
            return NextResponse.json({ received: true })
        }

        if (status === "approved") {
            console.log("✅ Pago aprobado, actualizando DB...")

            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "APPROVED",
                    mpPaymentId: mpPaymentId.toString(),
                },
            })

            await prisma.user.update({
                where: { id: payment.userId },
                data: { hasPaid: true },
            })

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

            console.log("🎉 Usuario actualizado correctamente")

        } else if (status === "rejected") {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "REJECTED",
                    mpPaymentId: mpPaymentId.toString(),
                },
            })
            console.log("❌ Pago rechazado")
        }

        return NextResponse.json({ received: true })

    } catch (error) {
        console.error("💥 Error en webhook:", error)
        console.error("Stack:", error.stack)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}