import { z } from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id','orderNumber','subTotal','deliveryFee','total','finalTotal','status','paymentMethod','paymentStatus','shippingAddress','customerNotes','butcherNotes','userId','createdAt','updatedAt']);

export default OrderScalarFieldEnumSchema;
