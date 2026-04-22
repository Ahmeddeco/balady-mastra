import z from "zod"

export const nonTrendingProductsSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  unit: z.string().nullable(),
  slug: z.string(),
  quantity: z.number(),
}))
