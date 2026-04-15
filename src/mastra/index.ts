
import { Mastra } from '@mastra/core/mastra'
import { LibSQLStore } from '@mastra/libsql'
import { MastraCompositeStore } from '@mastra/core/storage'
import { weatherWorkflow } from './workflows/weather-workflow'
import { weatherAgent } from './agents/weather-agent'
import { butcherWorkflow } from './workflows/butcher-workflow'
import { butcherAgent } from './agents/butcher-agent'
import { workflowRoute } from '@mastra/ai-sdk'

export const mastra = new Mastra({
  // server: {
  //   apiRoutes: [
  //     workflowRoute({ path: "/workflow", workflow: "butcherWorkflow" }),
  //   ]
  // },
  workflows: { weatherWorkflow, butcherWorkflow },
  agents: { weatherAgent, butcherAgent },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:D:/WORK/Portfolio/next/balady-mastra/mastra.db",
    }),
  }),
})
