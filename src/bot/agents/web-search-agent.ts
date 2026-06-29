import { Agent } from '@mastra/core/agent'
import { Memory } from "@mastra/memory"
import { AgentBrowser } from '@mastra/agent-browser'
import { ollama } from 'ollama-ai-provider-v2'

const browser = new AgentBrowser({
  headless: false
})

export const webSearchAgent = new Agent({
  id: 'web-search-agent',
  name: 'Web Search Agent',
  model: ollama("gemma4:12b"),
  browser,
  instructions: `You are a web automation assistant.

When interacting with pages:
1. Use browser_snapshot to get the current page state and element refs
2. Use the refs (like @e1, @e2) to target elements for clicks and typing
3. After actions, take another snapshot to verify the result`,
  memory: new Memory(),
})