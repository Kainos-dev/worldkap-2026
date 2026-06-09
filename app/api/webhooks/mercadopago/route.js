import { MercadoPagoConfig, Payment } from "mercadopago"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
})

export async function POST(request) {
    try {
        // Verificar firma de MP
        const signature = request.headers.get("x-signature")
        const requestId = request.headers.get("x-request-id")
        const body = await request.text()
        const params = new URL(request.url).searchParams
        const dataId = params.get("data.id")

        if (signature) {
            const [tsPart, v1Part] = signature.split(",")
            const ts = tsPart?.split("=")[1]
            const v1 = v1Part?.split("=")[1]
            const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
            const hmac = crypto
                .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
                .update(manifest)
                .digest("hex")

            if (hmac !== v1) {
                return Response.json({ error: "Firma inválida" }, { status: 401 })
            }
        }

        const data = JSON.parse(body)

        // MP manda distintos tipos de notificaciones
        if (data.type !== "payment") {
            return Response.json({ ok: true })
        }

        // Obtener el pago completo desde la API de MP
        const paymentClient = new Payment(client)
        const mpPayment = await paymentClient.get({ id: data.data.id })

        const externalReference = mpPayment.external_reference // nuestro payment.id
        const status = mpPayment.status // approved | rejected | pending

        if (!externalReference) {
            return Response.json({ ok: true })
        }

        if (status === "approved") {
            // Todo en una transacción
            await prisma.$transaction(async (tx) => {
                // 1. Actualizar el pago
                await tx.payment.update({
                    where: { id: externalReference },
                    data: {
                        status: "APPROVED",
                        mpPaymentId: String(mpPayment.id),
                    },
                })

                const payment = await tx.payment.findUnique({
                    where: { id: externalReference },
                })

                // 2. Marcar usuario como pagado
                await tx.user.update({
                    where: { id: payment.userId },
                    data: { hasPaid: true },
                })

                // 3. Agregar a la liga general
                const generalLeague = await tx.league.findFirst({
                    where: { type: "GENERAL_PAID" },
                })

                if (generalLeague) {
                    await tx.leagueMember.upsert({
                        where: {
                            leagueId_userId: {
                                leagueId: generalLeague.id,
                                userId: payment.userId,
                            },
                        },
                        create: {
                            leagueId: generalLeague.id,
                            userId: payment.userId,
                        },
                        update: {},
                    })
                }
            })
        } else if (status === "rejected") {
            await prisma.payment.update({
                where: { id: externalReference },
                data: {
                    status: "REJECTED",
                    mpPaymentId: String(mpPayment.id),
                },
            })
        }

        return Response.json({ ok: true })
    } catch (error) {
        console.error("Webhook error:", error)
        return Response.json({ error: "Error interno" }, { status: 500 })
    }
}