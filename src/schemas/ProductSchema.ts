import CategorySchema from "@/generated/inputTypeSchemas/CategorySchema"
import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import UnitSchema from "@/generated/inputTypeSchemas/UnitSchema"
import { z } from 'zod'

export const ProductSchema = z.object({
  cut: MeatTypeSchema,
  category: CategorySchema,
  unit: UnitSchema,
  id: z.string().nullish(),
  title: z.string(),
  slug: z.string().optional(),
  description: z.string(),
  mainImage: z.string(),
  images: z.string().array().default([]),
  price: z.coerce.number().positive(),
  discount: z.coerce.number().positive().nullish().default(0),
  stock: z.coerce.number().positive(),
  lowQuantity: z.coerce.number().positive().nullish().default(0),
  increaseByOne: z.boolean().default(false),
  isActive: z.boolean().default(true),
  cattleId: z.string().nullish(),
})

export type Product = z.infer<typeof ProductSchema>

export default ProductSchema