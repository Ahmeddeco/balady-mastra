import CategorySchema from "@/generated/inputTypeSchemas/CategorySchema"
import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import UnitSchema from "@/generated/inputTypeSchemas/UnitSchema"
import { z } from 'zod'

export const ProductSchema = z.object({
  cut: MeatTypeSchema,
  category: CategorySchema,
  unit: UnitSchema,
  id: z.string().nullish(),
  titleAr: z.string(),
  titleEn: z.string(),
  slug: z.string().optional(),
  descriptionAr: z.string(),
  descriptionEn: z.string(),
  mainImage: z.string(),
  images: z.string().array().default([]),
  price: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).max(99).nullish().default(0),
  stock: z.coerce.number().positive(),
  lowQuantity: z.coerce.number().positive().nullish().default(0),
  increaseByOne: z.boolean().default(false),
  isActive: z.boolean().default(true),
  cattleId: z.string().nullish(),
})

export type Product = z.infer<typeof ProductSchema>

export default ProductSchema