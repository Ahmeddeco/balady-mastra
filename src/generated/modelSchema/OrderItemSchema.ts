import { z } from 'zod';
import { PreparationSchema } from '../inputTypeSchemas/PreparationSchema'

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  preparation: PreparationSchema,
  id: z.string(),
  quantity: z.number(),
  price: z.number(),
  requestedQuantity: z.number(),
  actualQuantity: z.number().nullish(),
  orderId: z.string(),
  productId: z.string(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export default OrderItemSchema;
