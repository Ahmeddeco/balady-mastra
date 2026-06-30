import { z } from 'zod';

export const PaymentStatusSchema = z.enum(['pending','success','failed']);

export type PaymentStatusType = `${z.infer<typeof PaymentStatusSchema>}`

export default PaymentStatusSchema;
