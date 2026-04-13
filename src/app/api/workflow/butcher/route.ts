import { butcherWorkflow } from "@/mastra/workflows/butcher-workflow"
import { NextResponse } from "next/server";

export async function GET() {
  try {
   const run = await butcherWorkflow.createRun()

const stream = run.stream({
  inputData: {
    message: 'Hello world',
  },
})

for await (const chunk of stream.fullStream) {
  console.log(chunk)
}

// Get the final result (same type as run.start())
const result = await stream.result

if (result.status === 'success') {
  console.log(result.result)
}
    return NextResponse.json({ message: "OK", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
} 