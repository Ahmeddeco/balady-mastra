import { Mastra } from '@mastra/core/mastra'
import { LibSQLStore } from '@mastra/libsql'
import { MastraCompositeStore } from '@mastra/core/storage'
import { weatherWorkflow } from './workflows/weather-workflow'
import { weatherAgent } from './agents/weather-agent'
import { butcherWorkflow } from './workflows/butcher-workflow'
import { butcherAgent } from './agents/butcher-agent'

export const mastra = new Mastra({
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
