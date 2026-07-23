import { socials } from "@/constants/socials"
import Link from "next/link"
import React from "react"

export default function Socials() {
	return (
		<nav className="flex items-center justify-center gap-8">
			{socials.map(({ href, icon }) => (
				<Link
					href={href}
					key={href}
					target="_blank"
					className="dark:hover:text-primary hover:text-secondary  ease-in-out duration-500"
				>
					{React.createElement(icon, { size: 24 })}
				</Link>
			))}
		</nav>
	)
}
