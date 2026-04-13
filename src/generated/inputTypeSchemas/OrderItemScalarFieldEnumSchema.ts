import { z } from 'zod';

export const OrderItemScalarFieldEnumSchema = z.enum(['id','quantity','price','orderId','productId']);

export default OrderItemScalarFieldEnumSchema;
