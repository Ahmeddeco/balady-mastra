import { Agent } from '@mastra/core/agent'
import { StagehandBrowser } from '@mastra/stagehand'
import { ollama } from 'ollama-ai-provider-v2'

const browser = new StagehandBrowser({
  headless: true, model: {
    modelName: "llama3.1",
    baseURL: "http://localhost:11434/v1", // المسار المتوافق مع OpenAI في Ollama
    apiKey: "ollama" // قيمة صورية لأن Ollama لا يتطلب مفتاحاً حقيقياً
  }
})

export const stagehandAgent = new Agent({
  id: 'stagehand-agent',
  name: 'Stagehand Browser',
  model: ollama("llama3.1"),
  browser,
  instructions: `You are a web automation assistant.

Use stagehand tools to interact with pages:
- stagehand_navigate to go to URLs
- stagehand_act to perform actions described in natural language
- stagehand_extract to get structured data from the page
- stagehand_observe to find available actions on the page`,
})