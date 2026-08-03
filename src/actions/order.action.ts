"use server"

import { OrderStatus, PaymentMethod, PaymentStatus, Preparation } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { CartItem } from "@/store/cartStore"




interface CreateOrderInput {
  userId?: string
  shippingAddress: string
  customerNotes?: string
  items: CartItem[]
  deliveryFee: number
}

export async function createOrder({ userId, shippingAddress, customerNotes, items, deliveryFee }: CreateOrderInput) {
  try {
    if (!items || items.length === 0) {
      throw new Error("السلة فارغة")
    }

    // 1. حساب المجموع الكلي
    const subTotal = items.reduce((sum, item) => {
      const qty = item.requestedQuantity ?? item.quantity ?? 1
      return sum + item.price * qty
    }, 0)
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
              quantity: item.requestedQuantity,
              requestedQuantity: item.requestedQuantity,
              preparation: item.preparation || Preparation.cubes,
              price: item.price,
              product: {
                connect: {
                  id: item.id,
                },
              },
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