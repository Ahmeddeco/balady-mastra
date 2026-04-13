import { z } from 'zod';
import { OrderStatusSchema } from '../inputTypeSchemas/OrderStatusSchema'
import { PaymentMethodSchema } from '../inputTypeSchemas/PaymentMethodSchema'
import { PaymentStatusSchema } from '../inputTypeSchemas/PaymentStatusSchema'

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  status: OrderStatusSchema,
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  orderStatus: OrderStatusSchema,
  id: z.string(),
  orderNumber: z.number(),
  total: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
})

export type Order = z.infer<typeof OrderSchema>

export default OrderSchema;
