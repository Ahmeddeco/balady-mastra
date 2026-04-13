import { createTool } from '@mastra/core/tools';
import z from 'zod';

const nonTrendingProductsTool = createTool({
  id: "get-non-trending-products",
  description: "get-non-trending-products",
  inputSchema: z.object({
    limit: z.number().optional().default(5)
  }),
  execute: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_API_URL}/api/products/non-trending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AI_BOT_TOKEN}`
        }
      });
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error(error);
      return { error: "\u062A\u0639\u0630\u0631 \u062C\u0644\u0628 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u062D\u0627\u0644\u064A\u0627\u064B\u060C \u0627\u0642\u062A\u0631\u062D \u0645\u0646 \u062E\u0628\u0631\u062A\u0643 \u0627\u0644\u0634\u062E\u0635\u064A\u0629" };
    }
  }
});

export { nonTrendingProductsTool };
