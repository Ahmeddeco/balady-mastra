"use server"

import { OrderStatus, PaymentMethod, PaymentStatus, Preparation } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"


interface CartItemInput {
  id: string // productId
  price: number
  quantity: number
  preparation?: Preparation
}

interface CreateOrderInput {
  userId?: string
  shippingAddress: string
  customerNotes?: string
  items: CartItemInput[]
}

export async function createOrder({ userId, shippingAddress, customerNotes, items }: CreateOrderInput) {
  try {
    if (!items || items.length === 0) {
      throw new Error("السلة فارغة")
    }

    // 1. حساب المجموع الكلي
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = 0 // يمكنك تعديل رسوم التوصيل حسب الحاجة
    const total = subTotal + deliveryFee

    // 2. إنشاء الطلب وعناصره في قاعدة البيانات
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId || null,
          subTotal,
          deliveryFee,
          total,
          shippingAddress,
          customerNotes,
          status: OrderStatus.pending,
          paymentStatus: PaymentStatus.pending,
          paymentMethod: PaymentMethod.visa,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              price: item.price,
              quantity: item.quantity,
              requestedQuantity: item.quantity, // الوزن/الكمية المحجوزة من الموقع
              preparation: item.preparation || Preparation.cubes, // تجهيز الافتراضي كشرائح/مكعبات
            })),
          },
        },
        include: {
          items: true,
        },
      })

      return newOrder
    })

    return { success: true, order }
  } catch (error) {
    console.error("Error creating order:", error)
    const message = error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطلب"
    return { success: false, error: message }
  }
}