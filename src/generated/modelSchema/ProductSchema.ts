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
  unit: UnitSchema,
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  mainImage: z.string(),
  images: z.string().array(),
  price: z.number(),
  discount: z.number().nullish(),
  stock: z.number(),
  lowQuantity: z.number().nullish(),
  increaseByOne: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof ProductSchema>

export default ProductSchema;
