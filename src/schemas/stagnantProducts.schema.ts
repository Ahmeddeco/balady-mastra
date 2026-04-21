import z from "zod"

export const stagnantProductsSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  unit: z.string().nullable(),
  slug: z.string(),
  quantity: z.number(),
  description: z.string(),
}))