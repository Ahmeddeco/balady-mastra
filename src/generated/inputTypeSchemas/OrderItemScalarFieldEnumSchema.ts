import { z } from 'zod';

export const OrderItemScalarFieldEnumSchema = z.enum(['id','preparation','quantity','price','requestedQuantity','actualQuantity','orderId','productId']);

export default OrderItemScalarFieldEnumSchema;
