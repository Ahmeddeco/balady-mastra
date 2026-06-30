import { z } from 'zod';

export const OrderStatusSchema = z.enum(['pending','shipped','completed','cancelled']);

export type OrderStatusType = `${z.infer<typeof OrderStatusSchema>}`

export default OrderStatusSchema;
