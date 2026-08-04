'use server'

import { getOneUser } from "@/dl/user.data"
import { StripEmptyObjects } from "better-auth"
import { redirect } from "next/navigation"

interface CreateIntentionParams {
  amount: number
  orderId: string
  items: { name: string; amount: number }[]
  user: StripEmptyObjects<{
    id: string
    createdAt: Date
    updatedAt: Date
    email: string
    emailVerified: boolean
    name: string
    image?: string | null | undefined
  }> | undefined
}

export async function createPaymobCheckout({ amount, orderId, items, user }: CreateIntentionParams) {
  const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
  const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY
  const INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID)
  const BASE_URL = process.env.PAYMOB_BASE_URL
  const PAYMOB_Secret_KEY = process.env.PAYMOB_Secret_KEY
  const dbUser = await getOneUser(user?.id ?? "")
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (!PAYMOB_API_KEY || !PAYMOB_PUBLIC_KEY || !PAYMOB_Secret_KEY || !BASE_URL) {
    throw new Error("Paymob keys are missing in environment variables.")
  }

  const redirectUrl = new URL(`${appBaseUrl.replace(/\/$/, "")}/ar/success`)
  redirectUrl.searchParams.set("orderId", orderId)

  const response = await fetch(`${BASE_URL}/v1/intention/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${PAYMOB_Secret_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "EGP",
      payment_methods: [INTEGRATION_ID],
      items,
      special_reference: orderId,
      redirection_url: redirectUrl.toString(),
      notification_url: `${appBaseUrl.replace(/\/$/, "")}/api/paymob/webhook`,
      billing_data: {
        first_name: user?.name || "Customer",
        last_name: "last_name",
        email: user?.email,
        phone_number: dbUser?.mobile ?? "+201000000000",
      },
      customer: {},
      extras: {
        order_id: orderId,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Paymob error: ${errorText}`)
  }

  const intention = await response.json()
  const clientSecret = intention.client_secret

  const checkoutUrl = `${BASE_URL}/unifiedcheckout/?publicKey=${PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`

  redirect(checkoutUrl)
}