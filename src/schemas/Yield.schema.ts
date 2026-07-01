import { z } from 'zod'

export const YieldSchema = z.object({
  id: z.string().nullish(),
  cattleId: z.string(),
  report: z.string().nullish(),
  hotCarcassWeight: z.number().positive(),
  boneWeight: z.number().positive(),
  fatWeight: z.number().positive(),
  wasteWeight: z.number().positive(),
  netYieldWeight: z.number().positive(),
})

export type YieldReport = z.infer<typeof YieldSchema>

export default YieldSchema
