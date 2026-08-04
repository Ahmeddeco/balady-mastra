/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import crypto from "crypto"
import prisma from "@/lib/prisma"
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums"

interface VerifyPaymentParams {
  searchParams: Record<string, string | string[] | undefined>
}

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key]
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

export async function verifyAndProcessPayment({ searchParams }: VerifyPaymentParams) {
  try {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET
    const receivedHmac = getParam(searchParams, "hmac")

    const paymentPayload = {
      amount_cents: getParam(searchParams, "amount_cents"),
      created_at: getParam(searchParams, "created_at"),
      currency: getParam(searchParams, "currency"),
      error_occured: getParam(searchParams, "error_occured"),
      has_parent_transaction: getParam(searchParams, "has_parent_transaction"),
      id: getParam(searchParams, "id"),
      integration_id: getParam(searchParams, "integration_id"),
      is_3d_secure: getParam(searchParams, "is_3d_secure"),
      is_auth: getParam(searchParams, "is_auth"),
      is_capture: getParam(searchParams, "is_capture"),
      is_refunded: getParam(searchParams, "is_refunded"),
      is_standalone_payment: getParam(searchParams, "is_standalone_payment"),
      is_voided: getParam(searchParams, "is_voided"),
      order: getParam(searchParams, "order"),
      owner: getParam(searchParams, "owner"),
      pending: getParam(searchParams, "pending"),
      "source_data.pan": getParam(searchParams, "source_data.pan"),
      "source_data.sub_type": getParam(searchParams, "source_data.sub_type"),
      "source_data.type": getParam(searchParams, "source_data.type"),
      success: getParam(searchParams, "success"),
    }

    if (!hmacSecret || !receivedHmac) {
      return { success: false, error: "بيانات التوقيع الأمني مفقودة (HMAC missing)" }
    }

    const concatenatedString = [
      paymentPayload.amount_cents,
      paymentPayload.created_at,
      paymentPayload.currency,
      paymentPayload.error_occured,
      paymentPayload.has_parent_transaction,
      paymentPayload.id,
      paymentPayload.integration_id,
      paymentPayload.is_3d_secure,
      paymentPayload.is_auth,
      paymentPayload.is_capture,
      paymentPayload.is_refunded,
      paymentPayload.is_standalone_payment,
      paymentPayload.is_voided,
      paymentPayload.order,
      paymentPayload.owner,
      paymentPayload.pending,
      paymentPayload["source_data.pan"],
      paymentPayload["source_data.sub_type"],
      paymentPayload["source_data.type"],
      paymentPayload.success,
    ].join("")

    const calculatedHmac = crypto
      .createHmac("sha512", hmacSecret)
      .update(concatenatedString)
      .digest("hex")

    const isSuccess = paymentPayload.success === "true" && paymentPayload.pending === "false"
    const orderId =
      getParam(searchParams, "orderId") ||
      getParam(searchParams, "order") ||
      getParam(searchParams, "extras.order_id") ||
      getParam(searchParams, "merchant_order_id") ||
      ""
    const transactionId = getParam(searchParams, "id")

    if (calculatedHmac.toLowerCase() !== receivedHmac.toLowerCase()) {
      return { success: false, error: "توقيع العملية غير محقق (Invalid HMAC)" }
    }

    if (!orderId) {
      return { success: false, error: "لم يتم العثور على معرف الطلب" }
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    })

    if (!existingOrder) {
      console.error("[Paymob] order not found in DB", { orderId })
      return { success: false, error: "لم يتم العثور على الطلب في قاعدة البيانات" }
    }

    if (isSuccess) {
      await prisma.order.updateMany({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.success,
          status: OrderStatus.completed,
        },
      })
      return {
        success: true,
        orderId,
        transactionId,
        message: "تم تأكيد عملية الدفع وتحديث الطلب بنجاح",
      }
    }

    await prisma.order.updateMany({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.failed,
        status: OrderStatus.cancelled,
      },
    })
    return { success: false, error: "فشلت عملية الدفع" }
  } catch (error: any) {
    console.error("Payment Verification Error:", error)
    return { success: false, error: error.message || "حدث خطأ غير متوقع" }
  }
}