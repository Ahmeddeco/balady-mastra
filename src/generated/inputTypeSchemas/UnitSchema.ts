import { z } from 'zod';

export const UnitSchema = z.enum(['كجم','قطعة']);

export type UnitType = `${z.infer<typeof UnitSchema>}`

export default UnitSchema;
