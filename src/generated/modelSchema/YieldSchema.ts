import { z } from 'zod';

/////////////////////////////////////////
// YIELD SCHEMA
/////////////////////////////////////////

export const YieldSchema = z.object({
  id: z.string(),
  cattleId: z.string(),
  hotCarcassWeight: z.number(),
  boneWeight: z.number(),
  fatWeight: z.number(),
  wasteWeight: z.number(),
  netYieldWeight: z.number(),
  report: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Yield = z.infer<typeof YieldSchema>

export default YieldSchema;
