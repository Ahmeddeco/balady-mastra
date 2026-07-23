"use client"

import { useState } from "react"
import { PromptInput, PromptInputBody, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { PromptInputMessage } from "../ai-elements/prompt-input"
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { MessageSquare } from "lucide-react"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"

export default function ChatBot() {
	const [input, setInput] = useState("")
	const { messages, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	})

	const handleSubmit = (message: PromptInputMessage) => {
		if (message.text.trim()) {
			sendMessage({ text: message.text })
			setInput("")
		}
	}

	return (
		<>
			<section className="max-w-4xl mx-auto mt-4 relative size-full rounded-lg border h-[90vh]">
				<div className="flex flex-col h-full">
					<Conversation>
						<ConversationContent>
							{messages.length === 0 ? (
								<ConversationEmptyState
									icon={<MessageSquare className="size-12" />}
									title="Start a conversation"
									description="Type a message below to begin chatting"
								/>
							) : (
								messages.map((message) => (
									<Message from={message.role} key={message.id}>
										<MessageContent>
											{message.parts.map((part, i) => {
												switch (part.type) {
													case "text":
														return <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
													default:
														return null
												}
											})}
										</MessageContent>
									</Message>
								))
							)}
						</ConversationContent>
						<ConversationScrollButton />
					</Conversation>

					{/* <PromptInput onSubmit={handleSubmit} className="mt-4 w-full max-w-2xl mx-auto relative">
						<PromptInputTextarea
							value={input}
							placeholder="مرحبا , كيف يمكن أن أساعدك ..."
							onChange={(e) => {
								e.preventDefault()
								setInput(e.currentTarget.value)
							}}
							className="pr-12"
						/> */}
					{/* <PromptInputSubmit
							status={status === "streaming" ? "streaming" : "ready"}
							disabled={!input.trim()}
							className="absolute bottom-1 right-1"
						/> */}
					{/* </PromptInput> */}

					<PromptInput onSubmit={handleSubmit} className="w-xl">
						<PromptInputBody>
							<PromptInputTextarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Add Text + Files"
							/>
						</PromptInputBody>
					</PromptInput>
				</div>
			</section>
		</>
	)
}
