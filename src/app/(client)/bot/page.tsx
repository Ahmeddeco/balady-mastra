import BotChat from "@/components/shared/BotChat"

export default function BotPage() {
	return (
		<BotChat
			apiRoute={"/api/agents/butcher"}
			emptyTitle={"أهلا , أنا روز-بوت"}
			emptyDescription={"مساعدك الذكي  في اختيار أجود أنواع اللحوم اللي تناسب ذوقك"}
		/>
	)
}
