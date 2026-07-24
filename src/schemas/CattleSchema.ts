import AgeSchema from "@/generated/inputTypeSchemas/AgeSchema"
import GenderSchema from "@/generated/inputTypeSchemas/GenderSchema"
import { z } from 'zod'

export const CattleSchema = z.object({
  gender: GenderSchema,
  age: AgeSchema,
  id: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string(),
  images: z.string().array(),
  farmId: z.string(),
  breedId: z.string(),
  liveWeight: z.coerce.number().positive().nullish(),
  costPrice: z.coerce.number().positive().nullish(),
})

export type Cattle = z.infer<typeof CattleSchema>

export default CattleSchema
