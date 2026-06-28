import CategorySchema from "@/generated/inputTypeSchemas/CategorySchema"
import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import UnitSchema from '@/generated/inputTypeSchemas/UnitSchema'
import { z } from 'zod'

export const ProductSchema = z.object({
  cut: MeatTypeSchema,
  category: CategorySchema,
  unit: UnitSchema.nullish(),
  id: z.string().nullish(),
  title: z.string(),
  slug: z.string().nullish(),
  description: z.string(),
  mainImage: z.string(),
  images: z.string().array(),
  price: z.number(),
  discount: z.number().nullish(),
  quantity: z.number(),
  lowQuantity: z.number().nullish(),
})

export type Product = z.infer<typeof ProductSchema>

export default ProductSchema
