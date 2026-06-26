import { z } from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id','orderNumber','subTotal','deliveryFee','total','status','paymentMethod','paymentStatus','shippingAddress','customerNotes','butcherNotes','createdAt','updatedAt','userId']);

export default OrderScalarFieldEnumSchema;
