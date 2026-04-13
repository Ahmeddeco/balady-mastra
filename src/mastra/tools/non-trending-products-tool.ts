import { createTool } from "@mastra/core/tools"
import z from "zod"

export const nonTrendingProductsTool = createTool({
  id: 'get-non-trending-products',
  description: 'get-non-trending-products',
  inputSchema: z.object({
    limit: z.number().optional().default(5),
  }),
  execute: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_API_URL}/api/products/non-trending`, {
        method: 'GET', headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_BOT_TOKEN}`,
        }
      })
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
      return await res.json()
    } catch (error) {
      console.error(error)

      return { error: "تعذر جلب البيانات حالياً، اقترح من خبرتك الشخصية" }
    }
  }
})