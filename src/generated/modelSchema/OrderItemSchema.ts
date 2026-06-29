import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../prisma/internal/prismaNamespace';
import { PreparationSchema } from '../inputTypeSchemas/PreparationSchema'

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  preparation: PreparationSchema,
  id: z.string(),
  quantity: z.instanceof(PrismaDecimal, { message: "Field 'quantity' must be a Decimal. Location: ['Models', 'OrderItem']"}),
  price: z.instanceof(PrismaDecimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'OrderItem']"}),
  requestedQuantity: z.instanceof(PrismaDecimal, { message: "Field 'requestedQuantity' must be a Decimal. Location: ['Models', 'OrderItem']"}),
  actualQuantity: z.instanceof(PrismaDecimal, { message: "Field 'actualQuantity' must be a Decimal. Location: ['Models', 'OrderItem']"}).nullish(),
  orderId: z.string(),
  productId: z.string(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export default OrderItemSchema;
