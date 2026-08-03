'use server'

import { redirect } from 'next/navigation'

interface CreateIntentionParams {
  amount: number // المبلغ بالقروش
  orderId: string
}
// TODO: Add a real data from Order data in the cart.
export async function createPaymobCheckout({ amount, orderId }: CreateIntentionParams) {
  const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
  const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY
  const INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID)
  const BASE_URL = process.env.PAYMOB_BASE_URL
  const PAYMOB_Secret_KEY = process.env.PAYMOB_Secret_KEY

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
      items: [
        {
          name: 'Product',
          amount,
          description: 'Order item',
          quantity: 1,
        },
      ],
      billing_data: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone_number: '+201000000000',
      },
      customer: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
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