import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import z from "zod"

export const nonTrendingProductsSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  unit: z.string().nullable(),
  slug: z.string(),
  cut: MeatTypeSchema,
  stock: z.number(),
}))
