import { z } from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id','orderNumber','total','status','paymentMethod','paymentStatus','orderStatus','createdAt','updatedAt','userId']);

export default OrderScalarFieldEnumSchema;
