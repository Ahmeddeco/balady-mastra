import { z } from 'zod';
import { Decimal as PrismaDecimal } from '../prisma/internal/prismaNamespace';
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
  price: z.instanceof(PrismaDecimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'Product']"}),
  discount: z.number().nullish(),
  stock: z.instanceof(PrismaDecimal, { message: "Field 'stock' must be a Decimal. Location: ['Models', 'Product']"}),
  lowQuantity: z.instanceof(PrismaDecimal, { message: "Field 'lowQuantity' must be a Decimal. Location: ['Models', 'Product']"}).nullish(),
  increaseByOne: z.boolean(),
  isActive: z.boolean(),
  cattleId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof ProductSchema>

export default ProductSchema;
