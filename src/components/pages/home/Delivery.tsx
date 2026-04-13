import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { delivery } from "@/constants/home"
import React from "react"

export default function Delivery() {
	return (
		<section className="flex flex-col items-center justify-center gap-8">
			<h2>مراحل عملية الشراء</h2>
			<div className="flex flex-wrap items-center justify-center gap-8">
				{delivery.map(({ description, icon, title }, index) => (
					<Card key={index} className="w-full lg:w-md aspect-video ">
						<CardHeader className="justify-center">{React.createElement(icon, { size: 100 })}</CardHeader>
						<CardContent className="flex flex-col items-center justify-center gap-2">
							<h3 className="text-center ">{title}</h3>
							<p className="text-center">{description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	)
}
