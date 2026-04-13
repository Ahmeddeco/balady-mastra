import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { whyChooseUs } from "@/constants/home"
import React from "react"
import RedChili from "@public/images/transparent/redChili.webp"
import Image from "next/image"

export default function WhyChooseUs() {
	return (
		<section className="flex flex-col items-center justify-center gap-8">
			<h2>لماذا تختار منتجاتنا ؟</h2>
			<div className=" flex flex-wrap items-center justify-center gap-4">
				{whyChooseUs.map(({ description, icon, title }, index) => (
					<Item variant={"muted"} key={index} className="w-sm">
						<ItemMedia>{React.createElement(icon, { className: "size-20" })}</ItemMedia>
						<ItemContent>
							<ItemTitle>{title}</ItemTitle>
							<ItemDescription>{description}</ItemDescription>
						</ItemContent>
					</Item>
				))}
			</div>
			<Image src={RedChili} alt={"Red Chili"} className="object-contain" />
		</section>
	)
}
