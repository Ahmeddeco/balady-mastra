import { z } from 'zod';

export const GenderSchema = z.enum(['ذكر','أنثى']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

export default GenderSchema;
