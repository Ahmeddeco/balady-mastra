import { z } from 'zod';

export const PaymentMethodSchema = z.enum(['VISA','CASH']);

export type PaymentMethodType = `${z.infer<typeof PaymentMethodSchema>}`

export default PaymentMethodSchema;
