import { z } from 'zod';

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  price: z.number(),
  orderId: z.string(),
  productId: z.string(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export default OrderItemSchema;
