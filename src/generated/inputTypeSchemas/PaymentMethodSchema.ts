import { z } from 'zod';

export const PaymentMethodSchema = z.enum(['visa','cash']);

export type PaymentMethodType = `${z.infer<typeof PaymentMethodSchema>}`

export default PaymentMethodSchema;
