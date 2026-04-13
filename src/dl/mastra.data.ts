
// import { mastra } from "@/mastra" // تأكد من المسار الصحيح لملف الماسترا الرئيسي

// export async function getButcherRecommendation(limit: number = 5) {
//   const workflow = mastra.getWorkflowById("butcher-workflow")
//   const start = workflow.createRun()
//   const result = await (await start).start({ inputData: { limit } })
//   return result
// }

export const getWorkflowStream = async (limit: number = 5) => {
  const response = await fetch("http://localhost:3000/api/workflow", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ limit })
  })

  return response
}