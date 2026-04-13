"use client"

import { frontNavLinks } from "@/constants/nav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

export default function FrontNavigation() {
	const pathName = usePathname()

	return (
		<>
			{frontNavLinks.map((link) => (
				<Button asChild key={link.title} variant={pathName === link.href ? "default" : "ghost"}>
					<Link href={link.href}>{link.title}</Link>
				</Button>
			))}
		</>
	)
}
