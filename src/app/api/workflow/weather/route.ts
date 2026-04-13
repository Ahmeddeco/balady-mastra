import { handleChatStream } from '@mastra/ai-sdk'
import { createUIMessageStreamResponse } from 'ai'
import { mastra } from '@/mastra'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const stream = await handleChatStream({
    mastra,
    agentId: 'weatherAgent',
    params: {
      messages: [
        {
          id: '1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    },
  })
  return createUIMessageStreamResponse({ stream })
}