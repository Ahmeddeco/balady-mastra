import { z } from 'zod'

export const YieldReportSchema = z.object({
  id: z.string().nullish(),
  cattleId: z.string(),
  hotCarcassWeight: z.number(),
  boneWeight: z.number(),
  fatWeight: z.number(),
  wasteWeight: z.number(),
  netYieldWeight: z.number(),
})

export type YieldReport = z.infer<typeof YieldReportSchema>

export default YieldReportSchema
