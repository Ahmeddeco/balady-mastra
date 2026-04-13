import { z } from 'zod';

export const OrderStatusSchema = z.enum(['PENDING','SHIPPED','COMPLETED','CANCELLED']);

export type OrderStatusType = `${z.infer<typeof OrderStatusSchema>}`

export default OrderStatusSchema;
