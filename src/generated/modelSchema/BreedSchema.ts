import { z } from 'zod';
import { CattleTypeSchema } from '../inputTypeSchemas/CattleTypeSchema'

/////////////////////////////////////////
// BREED SCHEMA
/////////////////////////////////////////

export const BreedSchema = z.object({
  type: CattleTypeSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  conversionRate: z.number().nullish(),
  image: z.string(),
  images: z.string().array(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Breed = z.infer<typeof BreedSchema>

export default BreedSchema;
