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
  id: z.string(),
  orderNumber: z.number(),
  subTotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  shippingAddress: z.string(),
  customerNotes: z.string().nullish(),
  butcherNotes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
})

export type Order = z.infer<typeof OrderSchema>

export default OrderSchema;
