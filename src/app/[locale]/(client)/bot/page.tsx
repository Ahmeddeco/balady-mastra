import BotChat from "@/components/shared/BotChat"

export default function BotPage() {
	return (
		<BotChat
			apiRoute={"/api/agents/butcher"}
			emptyTitle={{ ar: "أهلا , أنا روز-بوت", en: "Hello, I'm Rose-Bot" }}
			emptyDescription={{
				ar: "مساعدك الذكي  في اختيار أجود أنواع اللحوم اللي تناسب ذوقك",
				en: "Your smart assistant in choosing the finest types of meat that suit your taste",
			}}
			placeholder={{
				en: "Ask me here!",
				ar: "اسألني من هنا",
			}}
		/>
	)
}
