// scripts/test-payment.mjs  (lo corrés una sola vez con node)
const BUYER_ACCESS_TOKEN = "TESTUSER3889695199916587262" // el access token del Buyer Test User

const res = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${BUYER_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
        transaction_amount: 5000,
        token: "{{card_token}}",  // ver paso 2
        description: "Entrada Liga General",
        installments: 1,
        payment_method_id: "visa",
        payer: { email: "buyer@test.com" }
    })
})