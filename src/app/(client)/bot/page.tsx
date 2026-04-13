"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCompletion } from "@ai-sdk/react"

export default function Page() {
	const { completion, input, handleInputChange, handleSubmit, complete } = useCompletion({
		api: "/api/workflow/butcher",
	})
	console.log("complete", complete)
	console.log("completion", completion)

	return (
		<form onSubmit={handleSubmit} className="space-y-4 mt-12 container mx-auto">
			<h2>{completion}</h2>
			<Textarea name="prompt" value={input} onChange={handleInputChange} id="input" />
			<Button type="submit" size={"full"}>
				Submit
			</Button>
			<div>{completion}</div>
		</form>
	)
}
