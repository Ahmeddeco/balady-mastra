import { handleWorkflowStream } from '@mastra/ai-sdk'
import { createUIMessageStreamResponse } from 'ai'
import { mastra } from '@/mastra'

export async function POST(req: Request) {
  const params = await req.json()
  const stream = await handleWorkflowStream({
    mastra,
    workflowId: 'butcher-workflow',
    params,
  })
  return createUIMessageStreamResponse({ stream })
}