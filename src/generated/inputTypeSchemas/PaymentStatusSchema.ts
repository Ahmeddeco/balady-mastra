import { z } from 'zod';

export const PaymentStatusSchema = z.enum(['PENDING','SUCCESS','FAILED']);

export type PaymentStatusType = `${z.infer<typeof PaymentStatusSchema>}`

export default PaymentStatusSchema;
