import { z } from 'zod';

export const AgeSchema = z.enum(['صغير','وسيط','كبير']);

export type AgeType = `${z.infer<typeof AgeSchema>}`

export default AgeSchema;
