import { MercadoPagoConfig, Preference } from "mercadopago"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
})

export async function POST(request) {
    const session = await auth()

    if (!session?.user) {
        return Response.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    if (user.hasPaid) {
        return Response.json({ error: "Ya sos parte de la liga general" }, { status: 400 })
    }

    // Crear registro de pago pendiente
    const payment = await prisma.payment.create({
        data: {
            userId: user.id,
            mpPaymentId: `pending_${Date.now()}`, // temporal hasta que MP confirme
            status: "PENDING",
            amount: 5000,
        },
    })

    // Crear preferencia en MP
    const preference = new Preference(client)
    const response = await preference.create({
        body: {
            items: [
                {
                    id: payment.id,
                    title: "Liga General - Mundial 2026",
                    quantity: 1,
                    unit_price: 5000,
                    currency_id: "ARS",
                },
            ],
            payer: {
                email: user.email,
                name: user.name,
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_APP_URL}/leagues/payment/success`,
                failure: `${process.env.NEXT_PUBLIC_APP_URL}/leagues/payment/failure`,
                pending: `${process.env.NEXT_PUBLIC_APP_URL}/leagues/payment/pending`,
            },
            auto_return: "approved",
            external_reference: payment.id, // para identificar el pago en el webhook
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        },
    })

    return Response.json({ url: response.init_point })
}