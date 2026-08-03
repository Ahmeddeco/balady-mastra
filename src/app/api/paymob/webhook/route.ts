/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { obj, type } = body

    if (type !== "TRANSACTION") {
      return NextResponse.json({ received: true })
    }

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET
    const receivedHmac = new URL(request.url).searchParams.get("hmac")

    if (!hmacSecret || !receivedHmac) {
      return NextResponse.json({ error: "HMAC signature missing" }, { status: 400 })
    }

    // حساب HMAC الخاص بإشعارات הـ Webhook (ترتيب حقول الـ Webhook)
    const concatenatedString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order.id,
      obj.owner,
      obj.pending,
      obj.source_data.pan,
      obj.source_data.sub_type,
      obj.source_data.type,
      obj.success,
    ].join("")

    const calculatedHmac = crypto
      .createHmac("sha512", hmacSecret)
      .update(concatenatedString)
      .digest("hex")

    if (calculatedHmac.toLowerCase() !== receivedHmac.toLowerCase()) {
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 })
    }

    const isSuccess = obj.success === true && obj.pending === false
    const merchantOrderId = obj.order.merchant_order_id // رقم الطلب الخاص بنظامك

    if (isSuccess) {
      // 🟢 تحديث حالة الطلب إلى PAID في قاعدة البيانات (Prisma / Database)
      console.log(`✅ Order ${merchantOrderId} marked as PAID via Webhook.`)
    } else {
      // 🔴 تحديث حالة الطلب إلى FAILED
      console.log(`❌ Order ${merchantOrderId} marked as FAILED via Webhook.`)
    }

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}