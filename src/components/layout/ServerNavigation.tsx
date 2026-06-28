"use client"

import { serverNav } from "@/constants/serverNav"
import { SidebarMenu } from "../ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "../ui/button"
import React from "react"

export default function ServerNavigation() {
	const pathName = usePathname()

	return (
		<SidebarMenu>
			{serverNav.map(({ href, title, icon }) => (
				<SidebarMenu key={href}>
					<Button
						render={
							<Link href={href}>
								{React.createElement(icon)}
								{title}
							</Link>
						}
						variant={pathName === href ? "default" : "ghost"}
						size={"lg"}
						className="justify-start"
					/>
				</SidebarMenu>
			))}
		</SidebarMenu>
	)
}
