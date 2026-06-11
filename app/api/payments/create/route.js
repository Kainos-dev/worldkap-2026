import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Preference } from "mercadopago"
import client from "@/lib/mercadopago"

const ENTRY_AMOUNT = 5000

export async function POST() {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const userId = session.user.id
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        // Ya pagó
        if (user?.hasPaid) {
            return NextResponse.json(
                { error: "Ya estás en la liga general" },
                { status: 400 }
            )
        }

        // Crear registro de pago pendiente en nuestra DB
        const payment = await prisma.payment.create({
            data: {
                userId,
                mpPaymentId: `pending-${userId}-${Date.now()}`,
                status: "PENDING",
                amount: ENTRY_AMOUNT,
            },
        })

        // Crear preferencia en MP
        const preference = new Preference(client)

        // Justo antes del preference.create(...)
        /* console.log("MP Preference body:", JSON.stringify({
            payer_email: process.env.NODE_ENV === "production" ? user?.email : process.env.MP_TEST_PAYER_EMAIL,
            access_token: process.env.MP_ACCESS_TOKEN?.slice(0, 30) + "...",
            node_env: process.env.NODE_ENV,
            app_url: process.env.NEXT_PUBLIC_APP_URL,
        }, null, 2)) */

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: payment.id,
                        title: "Prode Mundial 2026 — Liga General",
                        quantity: 1,
                        unit_price: ENTRY_AMOUNT,
                        currency_id: "ARS",
                    },
                ],
                payer: {
                    email: process.env.NODE_ENV === "production"
                        ? user?.email
                        : process.env.MP_TEST_PAYER_EMAIL,
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL}/leagues/join-general/success`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL}/leagues/join-general/failure`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL}/leagues/join-general/pending`,
                },
                auto_return: "approved",
                external_reference: payment.id,
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
            },
        })

        /* console.log("MP Response:", JSON.stringify(response, null, 2)) */

        return NextResponse.json({
            url: process.env.NODE_ENV === "production"
                ? response.init_point
                : response.sandbox_init_point
        })
    } catch (error) {
        console.error("Error creando preferencia MP:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}