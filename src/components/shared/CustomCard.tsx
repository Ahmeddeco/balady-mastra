import React from "react"
import { Card, CardContent } from "../ui/card"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

type Props = {
	icon: LucideIcon
	className?: string
	title: string
	titleBr: string
	paragraph: string
	link: string
	linkTitle: string
	color?: "black" | "white"
}

export default function CustomCard({
	icon,
	className,
	link,
	paragraph,
	title,
	titleBr,
	linkTitle,
	color = "white",
}: Props) {
	return (
		<Card className={`max-w-2xs ${className} ${color === "black" ? "bg-foreground" : "bg-background"}  `}>
			<CardContent className="flex flex-col gap-4">
				{React.createElement(icon, {
					className: `size-12 ${color === "black" ? "text-background" : "text-foreground"}`,
				})}
				<h2 className={`${color === "black" ? "text-background" : "text-foreground"}`}>
					{title} <br /> {titleBr}
				</h2>
				<h6 className={`line-clamp-2 ${color === "black" ? "text-background" : "text-foreground"}`}>{paragraph}</h6>
				<Link
					href={link}
					className={` ${color === "black" && "text-background"}  underline-offset-4 underline uppercase font-semibold`}
				>
					{linkTitle}
				</Link>
			</CardContent>
		</Card>
	)
}
