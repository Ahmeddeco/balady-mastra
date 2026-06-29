import { getNonTrendingProducts } from "@/dl/products.data"
import { nonTrendingProductsSchema } from "@/schemas/nonTrendingProducts.schema"
import { createTool } from "@mastra/core/tools"
import z from "zod"

export const getNonTrendingProductsTool = createTool({
  id: 'get-non-trending-products-tool',
  description: 'جلب قائمة بقطعيات اللحوم المتوفرة بكثرة والتي تعاني من بطء في المبيعات',
  inputSchema: z.object({
    limit: z.number().optional().default(3),
  }),
  outputSchema: nonTrendingProductsSchema,

  execute: async (inputData) => {
    try {
      const limit = inputData?.limit ?? 3
      const stagnantProducts = await getNonTrendingProducts(limit)
      return stagnantProducts
    } catch (error) {
      console.error('Error fetching stagnant products:', error)
      throw new Error("تعذر جلب البيانات حالياً من قاعدة البيانات")
    }
  }
})