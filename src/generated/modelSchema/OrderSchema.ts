import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../prisma/internal/prismaNamespace';
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
  subTotal: z.instanceof(PrismaDecimal, { message: "Field 'subTotal' must be a Decimal. Location: ['Models', 'Order']"}),
  deliveryFee: z.instanceof(PrismaDecimal, { message: "Field 'deliveryFee' must be a Decimal. Location: ['Models', 'Order']"}),
  total: z.instanceof(PrismaDecimal, { message: "Field 'total' must be a Decimal. Location: ['Models', 'Order']"}),
  shippingAddress: z.string(),
  customerNotes: z.string().nullish(),
  butcherNotes: z.string().nullish(),
  userId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Order = z.infer<typeof OrderSchema>

export default OrderSchema;
