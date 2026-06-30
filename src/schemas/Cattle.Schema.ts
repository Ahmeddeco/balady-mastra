import AgeSchema from "@/generated/inputTypeSchemas/AgeSchema"
import CattleTypeSchema from "@/generated/inputTypeSchemas/CattleTypeSchema"
import GenderSchema from "@/generated/inputTypeSchemas/GenderSchema"
import { Decimal } from "@prisma/client/runtime/client"
import { z } from 'zod'

export const CattleSchema = z.object({
  gender: GenderSchema,
  age: AgeSchema,
  id: z.string().nullish(),
  farmId: z.string(),
  breedId: z.string(),
  liveWeight: z.instanceof(Decimal, { message: "Field 'liveWeight' must be a Decimal. Location: ['Models', 'Cattle']" }).nullish(),
  costPrice: z.instanceof(Decimal, { message: "Field 'costPrice' must be a Decimal. Location: ['Models', 'Cattle']" }).nullish(),
})

export type Cattle = z.infer<typeof CattleSchema>

export default CattleSchema
