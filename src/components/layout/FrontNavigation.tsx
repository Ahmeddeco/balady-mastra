"use client"

import { frontNavLinks } from "@/constants/nav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import React from "react"
import { useCurrentLocale } from "@/locales/client.locale"

export default function FrontNavigation() {
	const pathName = usePathname()
	const locale = useCurrentLocale()

	return (
		<>
			{frontNavLinks.map((link) => {
				const isActive = pathName === `/${locale}${link.href}` || pathName === `${link.href}${locale}`

				return (
					<Button asChild key={link.href} variant={isActive ? "default" : "ghost"} size={"sm"}>
						<Link href={link.href}>
							{isActive ? React.createElement(link.icon) : null}
							{locale === "ar" ? link.title.ar : link.title.en}
						</Link>
					</Button>
				)
			})}
		</>
	)
}
