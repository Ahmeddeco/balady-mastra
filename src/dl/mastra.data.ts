import { mastra } from "@/mastra"

export const getButcherWorkflow = async () => {
  const workflow = mastra.getWorkflow('butcherWorkflow')
  const run = await workflow.createRun()

  const stream = run.stream({
    inputData: {
      limit: 3,
    },
  })

  // Get the final result (same type as run.start())
  const result = await stream.result

  if (result.status === 'success') {
    return result.result.finalAnswer
  }
}