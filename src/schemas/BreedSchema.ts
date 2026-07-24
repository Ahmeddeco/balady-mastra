import CattleTypeSchema from "@/generated/inputTypeSchemas/CattleTypeSchema"
import { z } from 'zod'

export const BreedSchema = z.object({
  id: z.string().nullish(),
  name: z.string(),
  description: z.string().nullish(),
  type: CattleTypeSchema,
  conversionRate: z.number().positive().nullish(),
  image: z.string(),
  images: z.string().array(),
})

export type Breed = z.infer<typeof BreedSchema>

export default BreedSchema
