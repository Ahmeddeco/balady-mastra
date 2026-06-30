import { z } from 'zod';

export const AgeSchema = z.enum(['young','medium','adult']);

export type AgeType = `${z.infer<typeof AgeSchema>}`

export default AgeSchema;
