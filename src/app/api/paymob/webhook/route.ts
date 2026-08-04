/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import crypto from "crypto"
import prisma from "@/lib/prisma"
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = body?.obj
    const type = body?.type

    if (type !== "TRANSACTION" || !payload) {
      return NextResponse.json({ received: true })
    }

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET
    const receivedHmac = new URL(request.url).searchParams.get("hmac")

    if (!hmacSecret || !receivedHmac) {
      return NextResponse.json({ error: "HMAC signature missing" }, { status: 400 })
    }

    const concatenatedString = [
      payload.amount_cents,
      payload.created_at,
      payload.currency,
      payload.error_occured,
      payload.has_parent_transaction,
      payload.id,
      payload.integration_id,
      payload.is_3d_secure,
      payload.is_auth,
      payload.is_capture,
      payload.is_refunded,
      payload.is_standalone_payment,
      payload.is_voided,
      payload.order?.id,
      payload.owner,
      payload.pending,
      payload.source_data?.pan,
      payload.source_data?.sub_type,
      payload.source_data?.type,
      payload.success,
    ].join("")

    const calculatedHmac = crypto
      .createHmac("sha512", hmacSecret)
      .update(concatenatedString)
      .digest("hex")

    if (calculatedHmac.toLowerCase() !== receivedHmac.toLowerCase()) {
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 })
    }

    const isSuccess = payload.success === true && payload.pending === false
    const merchantOrderId =
      payload?.order?.merchant_order_id ||
      payload?.order?.special_reference ||
      payload?.merchant_order_id ||
      payload?.special_reference ||
      payload?.order?.id ||
      ""

    console.log("[Paymob] webhook payload", {
      merchantOrderId,
      transactionId: payload.id,
      success: payload.success,
      pending: payload.pending,
      isSuccess,
    })

    if (merchantOrderId) {
      const updateResult = await prisma.order.updateMany({
        where: { id: merchantOrderId },
        data: {
          paymentStatus: isSuccess ? PaymentStatus.success : PaymentStatus.failed,
          status: isSuccess ? OrderStatus.completed : OrderStatus.cancelled,
        },
      })

      console.log("[Paymob] webhook update result", {
        merchantOrderId,
        updatedCount: updateResult.count,
      })
    }

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}