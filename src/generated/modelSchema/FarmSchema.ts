import { z } from 'zod';

/////////////////////////////////////////
// FARM SCHEMA
/////////////////////////////////////////

export const FarmSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Farm = z.infer<typeof FarmSchema>

export default FarmSchema;
