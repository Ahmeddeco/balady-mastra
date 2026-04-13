"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCompletion } from "@ai-sdk/react"

export default function Page() {
	const { completion, input, handleInputChange, handleSubmit, complete } = useCompletion({
		api: "/api/workflow/butcher",
	})
	console.log("complete", complete)
	console.log("completion", completion)

	return (
		<form onSubmit={handleSubmit}>
			<h2>{completion}</h2>
			<Input name="prompt" value={input} onChange={handleInputChange} id="input" />
			<Button type="submit">Submit</Button>
			<div>{completion}</div>
		</form>
	)
}
