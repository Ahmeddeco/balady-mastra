"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { RiRobot3Line } from "react-icons/ri"

// 1. استيراد مكونات الـ Message Scroller الرسمية من Shadcn (Base UI)
import {
	MessageScroller,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerButton,
	MessageScrollerViewport,
} from "@/components/ui/message-scroller"

// 2. استيراد مكونات الـ Message والـ Input الرسمية من ملف الـ ui/message
import {
	Message,
	MessageContent,
	MessageInput,
	MessageInputTextArea,
	MessageInputSubmit,
} from "@/components/ui/message"

export default function ChatBot() {
	const [input, setInput] = useState("")

	// الحفاظ على نفس الـ Transport ونفس الـ Endpoint الخاصة بك
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/agents/butcher",
		}),
	})

	// تصحيح دالة الإرسال لتتوافق مع معايير React 19 القياسية للفورم
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (input.trim()) {
			sendMessage({ text: input })
			setInput("")
		}
	}

	return (
		<div className="container mx-auto p-6 mt-12 size-full rounded-lg lg:border h-[86vh]">
			<div className="flex flex-col h-full gap-4">
				{/* تفعيل الـ Provider الخاص بالـ Scroll الذكي المتوافق مع الـ Streaming */}
				<MessageScrollerProvider>
					<MessageScroller className="flex-1">
						<MessageScrollerViewport>
							<MessageScrollerContent>
								{messages.length === 0 ? (
									// الالتزام بـ Docs: الـ Empty State يتم تنسيقه مباشرة داخل السكرولر بـ Tailwind
									<div className="flex flex-col items-center justify-center h-full my-auto text-center p-8">
										<RiRobot3Line size={150} className="text-muted-foreground mb-4" />
										<h3 className="text-xl font-bold">أهلاً، أنا روز-بوت</h3>
										<p className="text-sm text-muted-foreground max-w-sm mt-2">
											مساعدك الذكي في اختيار أجود أنواع اللحوم اللي تناسب ذوقك
										</p>
									</div>
								) : (
									messages.map((message) => (
										// ربط كل رسالة بالـ id لضمان عمل الـ Auto-scroll والـ Anchoring بشكل سليم
										<MessageScrollerItem key={message.id} id={message.id}>
											{/* المحاذاة تعتمد على الـ className (يمين للمستخدم، يسار للبوت) */}
											<Message className={message.role === "user" ? "items-end" : "items-start"}>
												<MessageContent>
													{message.parts.map((part, i) => {
														switch (part.type) {
															case "text":
																return <span key={`${message.id}-${i}`}>{part.text}</span>
															default:
																return null
														}
													})}
												</MessageContent>
											</Message>
										</MessageScrollerItem>
									))
								)}
							</MessageScrollerContent>
						</MessageScrollerViewport>
						{/* الزر الذكي المصدّر رسمياً للنزول لأسفل عند صعود المستخدم لأعلى */}
						<MessageScrollerButton />
					</MessageScroller>
				</MessageScrollerProvider>

				{/* الالتزام الكامل بهيكل الـ MessageInput الرسمي من Shadcn وربطه بفورم React القياسي */}
				<form onSubmit={handleSubmit} className="relative w-full mx-auto">
					<MessageInput>
						<MessageInputTextArea
							value={input}
							placeholder="كيف يمكنني ان أساعدك؟"
							onChange={(e) => setInput(e.target.value)}
							className="pr-12 min-h-[48px] max-h-[200px] resize-none"
							onKeyDown={(e) => {
								// الإرسال عند الضغط على Enter بدون Shift
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault()
									e.currentTarget.form?.requestSubmit()
								}
							}}
						/>
						<MessageInputSubmit
							status={status === "streaming" ? "streaming" : "ready"}
							disabled={!input.trim()}
							className="absolute bottom-2 right-2"
						/>
					</MessageInput>
				</form>
			</div>
		</div>
	)
}
