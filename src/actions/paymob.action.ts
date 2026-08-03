'use server'

import { getOneUser } from "@/dl/user.data"
import { StripEmptyObjects } from "better-auth"
import { redirect } from 'next/navigation'

interface CreateIntentionParams {
  amount: number // المبلغ بالقروش
  orderId: string
  items: { name: string, amount: number }[]
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
// TODO: Add a real data from Order data in the cart.
export async function createPaymobCheckout({ amount, orderId, items, user }: CreateIntentionParams) {
  const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
  const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY
  const INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID)
  const BASE_URL = process.env.PAYMOB_BASE_URL
  const PAYMOB_Secret_KEY = process.env.PAYMOB_Secret_KEY
  const dbUser = await getOneUser(user?.id ?? "")

  if (!PAYMOB_API_KEY || !PAYMOB_PUBLIC_KEY) {
    throw new Error('Paymob keys are missing in environment variables.')
  }

  const response = await fetch(`${BASE_URL}/v1/intention/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${PAYMOB_Secret_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'EGP',
      payment_methods: [INTEGRATION_ID], // ضع هنا الـ Integration IDs الخاصة بك
      items,
      billing_data: {
        first_name: user?.name,
        last_name: "last_name",
        email: user?.email,
        phone_number: dbUser?.mobile ?? '+201000000000',
      },
      customer: {

      },
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

  // التوجيه المباشر إلى صفحة الدفع Unified Checkout
  redirect(checkoutUrl)
}