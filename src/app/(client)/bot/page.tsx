import { getButcherWorkflow } from "@/dl/mastra.data"

export default async function BotPage() {
	const result = await getButcherWorkflow()
	console.log("result from Bot page : ", result)

	return <h3 className="container mx-auto m-12 max-w-4xl text-pretty leading-loose ">{result}</h3>
}
