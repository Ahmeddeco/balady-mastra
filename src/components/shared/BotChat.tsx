"use client"

import { Attachment, AttachmentPreview, AttachmentRemove, Attachments } from "@/components/ai-elements/attachments"
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionAddScreenshot,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputHeader,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputFooter,
	PromptInputTools,
	usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { DefaultChatTransport } from "ai"
import Image from "next/image"
import { FileIcon, LucideIcon } from "lucide-react"
import { Badge } from "../ui/badge"
import { RiRobot3Line } from "react-icons/ri"

type Props = {
	apiRoute: string
	placeholder?: string
	emptyTitle: string
	emptyDescription: string
}

const PromptInputAttachmentsDisplay = () => {
	const attachments = usePromptInputAttachments()

	if (attachments.files.length === 0) {
		return null
	}

	return (
		<Attachments variant="inline">
			{attachments.files.map((attachment) => (
				<Attachment data={attachment} key={attachment.id} onRemove={() => attachments.remove(attachment.id)}>
					<AttachmentPreview />
					<AttachmentRemove />
				</Attachment>
			))}
		</Attachments>
	)
}

/* --------------------------------- BotChat -------------------------------- */
export default function BotChat({
	apiRoute,
	placeholder = "مرحبا , كيف يمكن أن أساعدك ...",
	emptyTitle,
	emptyDescription,
}: Props) {
	const [text, setText] = useState<string>("")

	const { messages, status, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: apiRoute,
		}),
	})

	const handleSubmit = (message: PromptInputMessage) => {
		const hasText = Boolean(message.text)
		const hasAttachments = Boolean(message.files?.length)

		if (!(hasText || hasAttachments)) {
			return
		}

		sendMessage({
			text: message.text || "Sent with attachments",
			files: message.files,
		})
		setText("")
	}

	return (
		<div className="max-w-5xl mx-auto mt-6 p-6 relative size-full rounded-lg border h-[90vh]">
			<div className="flex flex-col h-full">
				<Conversation>
					<ConversationContent>
						{messages.length === 0 ? (
							<ConversationEmptyState
								icon={<RiRobot3Line size={150} />}
								title={emptyTitle}
								description={emptyDescription}
							/>
						) : (
							<>
								{messages.map((message) => (
									<Message from={message.role} key={message.id}>
										<MessageContent className="flex flex-wrap! flex-row! gap-2">
											{message.parts.map((part, i) => {
												switch (part.type) {
													case "file":
														// Check if it's an image (based on extension or standard logic)
														const isImage = part.url?.match(/\.(jpg|jpeg|png|gif)$/) || part.url?.includes("image")

														if (isImage) {
															return (
																<Image
																	src={part.url}
																	alt={"image"}
																	width={72}
																	height={72}
																	key={part.url}
																	className="object-cover aspect-square rounded-md"
																/>
															)
														} else {
															return (
																<Badge key={part.filename} variant={"outline"}>
																	<FileIcon />
																	{part.filename ?? "File"}
																</Badge>
															)
														}
													case "text":
														return <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
													default:
														return null
												}
											})}
										</MessageContent>
									</Message>
								))}
							</>
						)}
					</ConversationContent>
					<ConversationScrollButton />
				</Conversation>

				<PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
					<PromptInputHeader>
						<PromptInputAttachmentsDisplay />
					</PromptInputHeader>
					<PromptInputBody>
						<PromptInputTextarea
							value={text}
							placeholder={placeholder}
							onChange={(e) => {
								e.preventDefault()
								setText(e.currentTarget.value)
							}}
						/>
					</PromptInputBody>
					<PromptInputFooter>
						<PromptInputSubmit disabled={!text && !status} status={status} />
						<PromptInputTools>
							<PromptInputActionMenu>
								<PromptInputActionMenuTrigger />
								<PromptInputActionMenuContent className="w-fit">
									<PromptInputActionAddAttachments />
									<PromptInputActionAddScreenshot />
								</PromptInputActionMenuContent>
							</PromptInputActionMenu>
						</PromptInputTools>
					</PromptInputFooter>
				</PromptInput>
			</div>
		</div>
	)
}
