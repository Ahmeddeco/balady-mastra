import { z } from 'zod';

export const UnitSchema = z.enum(['kg','piece']);

export type UnitType = `${z.infer<typeof UnitSchema>}`

export default UnitSchema;
