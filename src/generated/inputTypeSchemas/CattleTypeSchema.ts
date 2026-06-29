import { z } from 'zod';

export const CattleTypeSchema = z.enum(['بقري','جاموسي','ماعز','غنم','جملي']);

export type CattleTypeType = `${z.infer<typeof CattleTypeSchema>}`

export default CattleTypeSchema;
