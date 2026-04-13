import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarFooter,
} from "@/components/ui/sidebar"
import Logo from "./Logo"
import { ThemeButton } from "../theme/ThemeButton"
import UserButton from "../auth/UserButton"
import ServerNavigation from "./ServerNavigation"

export function ServerSidebar() {
	return (
		<Sidebar dir="rtl" side="right">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<Logo />
					</SidebarGroupLabel>
					<SidebarGroupContent className="mt-4">
						<ServerNavigation />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="flex flex-row items-center justify-between">
				<ThemeButton />
				<UserButton />
			</SidebarFooter>
		</Sidebar>
	)
}
