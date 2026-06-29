import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../prisma/internal/prismaNamespace';
import { CattleTypeSchema } from '../inputTypeSchemas/CattleTypeSchema'
import { GenderSchema } from '../inputTypeSchemas/GenderSchema'
import { AgeSchema } from '../inputTypeSchemas/AgeSchema'

/////////////////////////////////////////
// CATTLE SCHEMA
/////////////////////////////////////////

export const CattleSchema = z.object({
  type: CattleTypeSchema,
  gender: GenderSchema,
  age: AgeSchema,
  id: z.string(),
  farmId: z.string(),
  breedId: z.string(),
  liveWeight: z.instanceof(PrismaDecimal, { message: "Field 'liveWeight' must be a Decimal. Location: ['Models', 'Cattle']"}).nullish(),
  costPrice: z.instanceof(PrismaDecimal, { message: "Field 'costPrice' must be a Decimal. Location: ['Models', 'Cattle']"}).nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Cattle = z.infer<typeof CattleSchema>

export default CattleSchema;
