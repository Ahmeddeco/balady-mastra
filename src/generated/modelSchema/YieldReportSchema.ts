import { z } from 'zod';

/////////////////////////////////////////
// YIELD REPORT SCHEMA
/////////////////////////////////////////

export const YieldReportSchema = z.object({
  id: z.string(),
  cattleId: z.string(),
  hotCarcassWeight: z.number(),
  boneWeight: z.number(),
  fatWeight: z.number(),
  wasteWeight: z.number(),
  netYieldWeight: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type YieldReport = z.infer<typeof YieldReportSchema>

export default YieldReportSchema;
