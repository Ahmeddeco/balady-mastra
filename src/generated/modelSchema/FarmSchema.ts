import { z } from 'zod';

/////////////////////////////////////////
// FARM SCHEMA
/////////////////////////////////////////

export const FarmSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  detailedAddress: z.string().nullish(),
  lat: z.string().nullish(),
  lng: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export type Farm = z.infer<typeof FarmSchema>

export default FarmSchema;
