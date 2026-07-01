import { z } from 'zod';
import { GenderSchema } from '../inputTypeSchemas/GenderSchema'
import { AgeSchema } from '../inputTypeSchemas/AgeSchema'

/////////////////////////////////////////
// CATTLE SCHEMA
/////////////////////////////////////////

export const CattleSchema = z.object({
  gender: GenderSchema,
  age: AgeSchema,
  id: z.string(),
  farmId: z.string(),
  breedId: z.string(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  images: z.string().array(),
  liveWeight: z.number().nullish(),
  costPrice: z.number().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Cattle = z.infer<typeof CattleSchema>

export default CattleSchema;
