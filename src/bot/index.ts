import { Mastra } from '@mastra/core/mastra'
import { weatherWorkflow } from './workflows/weather-workflow'
import { weatherAgent } from './agents/weather-agent'
import { butcherWorkflow } from './workflows/butcher-workflow'
import { butcherAgent } from './agents/butcher-agent'
import { webSearchAgent } from "./agents/web-search-agent"
import { chatRoute } from "@mastra/ai-sdk"
import { PostgresStore } from '@mastra/pg'

const storage = new PostgresStore({
  id: 'pg-storage',
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
})

export const mastra = new Mastra({
  workflows: { weatherWorkflow, butcherWorkflow },
  agents: { weatherAgent, butcherAgent, webSearchAgent },
  storage,
  server: {
    apiRoutes: [
      chatRoute({
        path: '/agents/butcher',
        agent: 'butcherAgent',
      }),
    ],
  },
})
