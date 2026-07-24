import { ServerSidebar } from "@/components/layout/ServerSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function ServerLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: "en" | "ar" }>
}) {
	const locale = (await params).locale

	return (
		<SidebarProvider suppressHydrationWarning>
			<ServerSidebar locale={locale} />
			<div className="w-full p-6 ">
				<SidebarTrigger />
				<div className="min-h-[80vh]">{children}</div>
			</div>
		</SidebarProvider>
	)
}
