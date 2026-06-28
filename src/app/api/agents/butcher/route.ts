import { createUIMessageStream, createUIMessageStreamResponse } from "ai"
import { toAISdkStream } from "@mastra/ai-sdk"
import { mastra } from "@/bot"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const agent = mastra.getAgent("butcherAgent")
  const stream = await agent.stream(messages)

  const uiMessageStream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      for await (const part of toAISdkStream(stream, { from: "agent" })) {
        if (part.type !== "finish") {
          writer.write(part)
        }
      }
    },
  })

  return createUIMessageStreamResponse({ stream: uiMessageStream })
}