"use client"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"
import type { WorkflowDataPart } from "@mastra/ai-sdk"

type WorkflowData = WorkflowDataPart["data"]

export default function ButcherWorkflow() {
	const [input, setInput] = useState("")

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/workflow/butcher",
			prepareSendMessagesRequest: ({ messages }) => ({
				body: {
					inputData: {
						// البيانات اللي بتبعتها للـ workflow
						query: messages[messages.length - 1]?.parts[0]?.text,
					},
				},
			}),
		}),
	})

	return (
		<div>
			{/* الـ Trigger */}
			<form
				onSubmit={(e) => {
					e.preventDefault()
					sendMessage({ text: input }) // هنا بيبدأ الـ workflow
					setInput("")
				}}
			>
				<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب سؤالك..." />
				<button type="submit" disabled={status !== "ready"}>
					إرسال
				</button>
			</form>

			{/* عرض النتائج */}
			{messages.map((message) => (
				<div key={message.id}>
					{message.parts.map((part, index) => {
						// عرض نص الـ agent (لو بتعمل pipe من agent)
						if (part.type === "text" && message.role === "assistant") {
							return <p key={index}>{part.text}</p>
						}

						// عرض بيانات الـ workflow (الخطوات والنتائج)
						if (part.type === "data-workflow") {
							const workflowData = part.data as WorkflowData
							return (
								<div key={index}>
									<h3>Workflow: {workflowData.name}</h3>
									<p>Status: {workflowData.status}</p>
									{Object.values(workflowData.steps).map((step) => (
										<div key={step.name}>
											<strong>{step.name}</strong>: {step.status}
											{<pre>{JSON.stringify(step.output, null, 2)}</pre>}
										</div>
									))}
								</div>
							)
						}
						return null
					})}
				</div>
			))}
		</div>
	)
}
