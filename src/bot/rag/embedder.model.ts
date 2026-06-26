import { ModelRouterEmbeddingModel } from "@mastra/core/llm"

export const embedder = new ModelRouterEmbeddingModel({
  providerId: "ollama",
  modelId: "embeddinggemma:300m",
  url: "http://localhost:11434/v1",
  apiKey: "not-needed"
})