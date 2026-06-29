import { Mastra } from '@mastra/core/mastra'
import { LibSQLStore } from '@mastra/libsql'
import { MastraCompositeStore } from '@mastra/core/storage'
import { weatherWorkflow } from './workflows/weather-workflow'
import { weatherAgent } from './agents/weather-agent'
import { butcherWorkflow } from './workflows/butcher-workflow'
import { butcherAgent } from './agents/butcher-agent'
import { chatRoute } from "@mastra/ai-sdk"
import { webSearchAgent } from "./agents/web-search-agent"

export const mastra = new Mastra({
  workflows: { weatherWorkflow, butcherWorkflow },
  agents: { weatherAgent, butcherAgent, webSearchAgent },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db",
    }),
  }),
  server: {
    apiRoutes: [
      chatRoute({
        path: '/chat',
        agent: 'agricultureAgent',
      }),
    ],
  },
})
