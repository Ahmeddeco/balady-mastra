"use client"

import { frontNavLinks } from "@/constants/nav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import React from "react"

export default function FrontNavigation() {
	const pathName = usePathname()

	return (
		<>
			{frontNavLinks.map((link) => {
				const isActive =
					pathName === link.href ||
					(link.href !== "/" && pathName.startsWith(`${link.href}/`)) ||
					(link.href !== "/" && pathName.startsWith(link.href))
				return (
					<Button
						asChild
						key={link.title}
						variant={isActive ? "default" : "ghost"}
						size={"sm"}
						// className="rounded-full"
					>
						<Link href={link.href}>
							{isActive ? React.createElement(link.icon) : null}
							{link.title}
						</Link>
					</Button>
				)
			})}
		</>
	)
}
