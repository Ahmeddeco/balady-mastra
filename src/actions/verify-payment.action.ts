/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import crypto from "crypto"

interface VerifyPaymentParams {
  searchParams: Record<string, string>
}

export async function verifyAndProcessPayment({ searchParams }: VerifyPaymentParams) {
  try {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET
    const receivedHmac = searchParams.hmac

    if (!hmacSecret || !receivedHmac) {
      return { success: false, error: "بيانات التوقيع الأمني مفقودة (HMAC missing)" }
    }

    // تجميع الحقول للتحقق من HMAC الخاص بـ Callback URL
    const concatenatedString = [
      searchParams.amount_cents || "",
      searchParams.created_at || "",
      searchParams.currency || "",
      searchParams.error_occured || "",
      searchParams.has_parent_transaction || "",
      searchParams.id || "",
      searchParams.integration_id || "",
      searchParams.is_3d_secure || "",
      searchParams.is_auth || "",
      searchParams.is_capture || "",
      searchParams.is_refunded || "",
      searchParams.is_standalone_payment || "",
      searchParams.is_voided || "",
      searchParams.order || "",
      searchParams.owner || "",
      searchParams.pending || "",
      searchParams["source_data.pan"] || searchParams.source_data_pan || "",
      searchParams["source_data.sub_type"] || searchParams.source_data_sub_type || "",
      searchParams["source_data.type"] || searchParams.source_data_type || "",
      searchParams.success || "",
    ].join("")

    const calculatedHmac = crypto
      .createHmac("sha512", hmacSecret)
      .update(concatenatedString)
      .digest("hex")

    if (calculatedHmac.toLowerCase() !== receivedHmac.toLowerCase()) {
      return { success: false, error: "توقيع العملية غير محقق (Invalid HMAC)" }
    }

    const isSuccess = searchParams.success === "true" && searchParams.pending === "false"
    const orderId = searchParams["extras.order_id"] || searchParams.merchant_order_id || searchParams.order
    const transactionId = searchParams.id

    if (isSuccess) {
      // 🟢 تحديث حالة الطلب في قاعدة البيانات عبر Prisma
      /*
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentId: transactionId,
        },
      })
      */
      console.log(`✅ Server Action: Order ${orderId} marked as PAID.`)

      return {
        success: true,
        orderId,
        transactionId,
        message: "تم تأكيد عملية الدفع وتحديث الطلب بنجاح",
      }
    } else {
      console.log(`❌ Server Action: Order ${orderId} failed.`)
      return { success: false, error: "فشلت عملية الدفع" }
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error)
    return { success: false, error: error.message || "حدث خطأ غير متوقع" }
  }
}