import Logo from "./Logo"
import { footerData, socials } from "@/constants/nav"
import Link from "next/link"
import React from "react"
import { Separator } from "../ui/separator"
import { Copyright } from "lucide-react"
import { Badge } from "../ui/badge"
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item"

export default function Footer() {
	return (
		<footer className="px-4  min-h-48 h-auto bg-foreground text-background mt-12">
			<div className="container mx-auto flex flex-col items-center justify-center gap-4 py-24 ">
				{/* -------------------------------- Logo -------------------------------- */}
				<div className="flex flex-col items-center justify-center gap-2">
					<Logo />
					<h6 className=" text-center text-balance">خبراء اللحوم في مصر</h6>
				</div>
				<div className="flex flex-col items-center justify-center gap-2">
					{footerData.map(({ icon, title }, index) => (
						<Item size={"sm"} variant={"default"} key={index}>
							<ItemMedia>{React.createElement(icon, { size: 24 })}</ItemMedia>
							<ItemContent>
								<ItemTitle>{title}</ItemTitle>
							</ItemContent>
						</Item>
					))}
				</div>
				<nav className="flex items-center justify-center gap-8">
					{socials.map(({ href, icon }) => (
						<Link href={href} key={href} target="_blank" className="hover:text-primary ease-in-out duration-500">
							{React.createElement(icon, { size: 24 })}
						</Link>
					))}
				</nav>
				<Separator />
				<Badge>
					<Copyright /> 2025 Ahmed Elgazzar. All rights reserved.
				</Badge>
			</div>
		</footer>
	)
}
