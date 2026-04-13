import { z } from 'zod';

export const UnitSchema = z.enum(['KG','PIECE']);

export type UnitType = `${z.infer<typeof UnitSchema>}`

export default UnitSchema;
