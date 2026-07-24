"use client"

import { SidebarMenu } from "../ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "../ui/button"
import React from "react"
import { serverNav } from "@/constants/serverNav"
import { useCurrentLocale } from "@/locales/client.locale"

export default function ServerNavigation() {
	const pathName = usePathname()
	const locale = useCurrentLocale()

	return (
		<SidebarMenu className="h-full space-y-2">
			{serverNav.map(({ href, title, icon }) => {
				const isActive = pathName === `/${locale}${href}`

				return (
					<SidebarMenu key={href}>
						<Button asChild variant={isActive ? "default" : "ghost"} size={"full"} className=" justify-start">
							<Link href={href}>
								{isActive ? React.createElement(icon) : null}
								{locale === "ar" ? title.ar : title.en}
							</Link>
						</Button>
					</SidebarMenu>
				)
			})}
		</SidebarMenu>
	)
}
