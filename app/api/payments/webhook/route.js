import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Payment } from "mercadopago"
import client from "@/lib/mercadopago"

export async function GET() {
    return NextResponse.json({ ok: true })
}

export async function POST(request) {
    console.log("🔔 Webhook POST recibido")

    try {
        const { searchParams } = new URL(request.url)
        const body = await request.text()
        console.log("📦 Body raw:", body)
        console.log("📦 Query params:", Object.fromEntries(searchParams))

        let data = {}
        try { data = JSON.parse(body) } catch (_) { }

        const type = data.type ?? data.topic ?? searchParams.get("topic")
        const mpPaymentId = data.data?.id ?? searchParams.get("id")

        console.log("📋 type resuelto:", type)
        console.log("💳 Payment ID resuelto:", mpPaymentId)

        if (type !== "payment" && type !== "merchant_order") {
            console.log("⏭️ Ignorando tipo:", type)
            return NextResponse.json({ received: true })
        }

        if (!mpPaymentId) {
            console.log("⚠️ Sin payment ID")
            return NextResponse.json({ received: true })
        }

        // Si es merchant_order, resolver el payment ID real
        let finalPaymentId = mpPaymentId
        if (type === "merchant_order") {
            console.log("🔍 Consultando merchant_order:", mpPaymentId)
            try {
                const orderRes = await fetch(
                    `https://api.mercadolibre.com/merchant_orders/${mpPaymentId}`,
                    { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
                )
                const order = await orderRes.json()
                console.log("📦 Payments en orden:", JSON.stringify(order.payments))

                const approvedPayment = order.payments?.find(p => p.status === "approved")
                    ?? order.payments?.[order.payments.length - 1]

                if (!approvedPayment) {
                    console.log("⚠️ Sin payments en la orden todavía")
                    return NextResponse.json({ received: true })
                }

                finalPaymentId = approvedPayment.id
                console.log("💳 Payment ID real:", finalPaymentId)
            } catch (e) {
                console.error("❌ Error consultando merchant_order:", e)
                return NextResponse.json({ received: true })
            }
        }

        // Consultar el pago a MP
        const paymentApi = new Payment(client)
        console.log("🔍 Consultando pago a MP...")

        let mpPayment
        try {
            mpPayment = await paymentApi.get({ id: finalPaymentId })
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
            console.log("⚠️ Pago no encontrado en DB:", externalReference)
            return NextResponse.json({ received: true })
        }

        if (status === "approved") {
            console.log("✅ Pago aprobado, actualizando DB...")

            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "APPROVED",
                    mpPaymentId: finalPaymentId.toString(),
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
                    mpPaymentId: finalPaymentId.toString(),
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