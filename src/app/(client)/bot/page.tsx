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
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { RiRobot3Line } from "react-icons/ri"

export default function BotPage() {
	const [input, setInput] = useState("")
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/agents/butcher",
		}),
	})

	const handleSubmit = (message: PromptInputMessage) => {
		if (message.text.trim()) {
			sendMessage({ text: message.text })
			setInput("")
		}
	}

	return (
		<div className=" container mx-auto p-6 mt-12 size-full rounded-lg lg:border h-[86vh] ">
			<div className="flex flex-col h-full">
				<Conversation>
					<ConversationContent>
						{messages.length === 0 ? (
							<ConversationEmptyState
								icon={<RiRobot3Line size={150} />}
								title="أهلا , أنا روز-بوت"
								description="مساعدك الذكي  في اختيار أجود أنواع اللحوم اللي تناسب ذوقك"
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
