import { z } from 'zod'

export const FarmSchema = z.object({
  id: z.string().nullish(),
  name: z.string(),
  userId: z.string(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  lat: z.string().nullish(),
  lng: z.string().nullish(),
  detailedAddress: z.string().nullish(),
})

export type Farm = z.infer<typeof FarmSchema>

export default FarmSchema
