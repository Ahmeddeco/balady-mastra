import { z } from 'zod';

export const CattleTypeSchema = z.enum(['أبقار','جاموس','ماعز','غنم','جمال']);

export type CattleTypeType = `${z.infer<typeof CattleTypeSchema>}`

export default CattleTypeSchema;
