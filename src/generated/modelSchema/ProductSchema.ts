import { z } from 'zod';
import { MeatTypeSchema } from '../inputTypeSchemas/MeatTypeSchema'
import { CategorySchema } from '../inputTypeSchemas/CategorySchema'
import { UnitSchema } from '../inputTypeSchemas/UnitSchema'

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  cut: MeatTypeSchema,
  category: CategorySchema,
  unit: UnitSchema.nullish(),
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  increaseByOne: z.boolean(),
  specialCut: z.boolean().nullish(),
  mainImage: z.string(),
  images: z.string().array(),
  price: z.number(),
  discount: z.number().nullish(),
  quantity: z.number(),
  lowQuantity: z.number().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().nullish(),
})

export type Product = z.infer<typeof ProductSchema>

export default ProductSchema;
