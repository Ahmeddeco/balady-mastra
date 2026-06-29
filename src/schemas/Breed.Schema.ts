import { Decimal } from "@prisma/client/runtime/client"
import { z } from 'zod'

export const BreedSchema = z.object({
  id: z.string().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  conversionRate: z.instanceof(Decimal, { message: "Field 'conversionRate' must be a Decimal. Location: ['Models', 'Breed']" }).nullish(),
  image: z.string(),
  images: z.string().array(),
})

export type Breed = z.infer<typeof BreedSchema>

export default BreedSchema
