"use client"

import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import {
	PromptInput,
	type PromptInputMessage,
	PromptInputTextarea,
	PromptInputSubmit,
} from "@/components/ai-elements/prompt-input"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

export default function BotPage() {
	const [input, setInput] = useState("")
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/workflow/butcher",
			prepareSendMessagesRequest: () => ({
				body: {
					inputData: {
						limit: 3,
					},
				},
			}),
		}),
	})

	const handleSubmit = (message: PromptInputMessage) => {
		if (message.text.trim()) {
			sendMessage({ text: message.text })
			setInput("")
		}
	}

	return (
		<div className="max-w-5xl mx-auto p-6 mt-12 size-full rounded-lg border h-[85vh]">
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
												case "text": // we don't use any reasoning or tool calls in this example
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

				<PromptInput onSubmit={handleSubmit} className="mt-4 w-full  mx-auto relative">
					<PromptInputTextarea
						value={input}
						placeholder="كيف يمكنني ان أساعدك؟"
						onChange={(e) => setInput(e.currentTarget.value)}
						className="pr-12"
					/>
					<PromptInputSubmit
						status={status === "streaming" ? "streaming" : "ready"}
						disabled={!input.trim()}
						className="absolute bottom-2 right-2"
					/>
				</PromptInput>
			</div>
		</div>
	)
}
