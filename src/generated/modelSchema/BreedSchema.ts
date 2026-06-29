import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../prisma/internal/prismaNamespace';

/////////////////////////////////////////
// BREED SCHEMA
/////////////////////////////////////////

export const BreedSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  conversionRate: z.instanceof(PrismaDecimal, { message: "Field 'conversionRate' must be a Decimal. Location: ['Models', 'Breed']"}).nullish(),
  image: z.string(),
  images: z.string().array(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Breed = z.infer<typeof BreedSchema>

export default BreedSchema;
