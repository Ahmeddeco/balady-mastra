import { z } from 'zod';

export const CattleTypeSchema = z.enum(['cow','buffalo','goat','sheep','camel']);

export type CattleTypeType = `${z.infer<typeof CattleTypeSchema>}`

export default CattleTypeSchema;
