import { ServerSidebar } from "@/components/layout/ServerSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function ServerLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<ServerSidebar />
			<div className="w-full p-6 ">
				<SidebarTrigger />
				<div className="min-h-[80vh]">{children}</div>
			</div>
		</SidebarProvider>
	)
}
