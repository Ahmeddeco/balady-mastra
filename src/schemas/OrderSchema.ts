import OrderStatusSchema from '@/generated/inputTypeSchemas/OrderStatusSchema'
import PaymentMethodSchema from '@/generated/inputTypeSchemas/PaymentMethodSchema'
import PaymentStatusSchema from '@/generated/inputTypeSchemas/PaymentStatusSchema'
import { z } from 'zod'

export const OrderSchema = z.object({
  status: OrderStatusSchema,
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  orderStatus: OrderStatusSchema,
  id: z.string().nullish(),
  orderNumber: z.number(),
  total: z.number(),
  userId: z.string().nullish(),
})

export type Order = z.infer<typeof OrderSchema>

export default OrderSchema
