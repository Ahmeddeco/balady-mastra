"use client"

import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { useState } from "react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Check, Circle } from "lucide-react"

type Props = {
	data: { id: string; titleAr: string; titleEn: string; colorCode: string; slug: string }[] | undefined
	inputName: string
	locale: "ar" | "en"
}

export default function SelectColors({ data, inputName, locale }: Props) {
	const [itemIds, setItemIds] = useState<string[]>([])
	const [slug, setSlug] = useState<string[]>([])

	const handleItemClick = (id: string, itemSlug: string) => {
		const isAlreadySelected = itemIds.includes(id)

		if (isAlreadySelected) {
			// إذا كان مختاراً مسبقاً، نقوم بحذفه من المصفوفتين
			setItemIds(itemIds.filter((itemId) => itemId !== id))
			setSlug(slug.filter((s) => s !== itemSlug))
		} else {
			// إذا لم يكن مختاراً، نقوم بإضافته للمصفوفتين
			setItemIds([...itemIds, id])
			setSlug([...slug, itemSlug])
		}
	}

	return (
		<ScrollArea className="h-64">
			{slug.map((classSlug) => (
				<Input key={classSlug} type="hidden" name={inputName} value={classSlug} />
			))}
			{data?.map(({ id, colorCode, slug, titleAr, titleEn }) => {
				const isSelected = itemIds.includes(id)
				return (
					<Item
						size={"sm"}
						key={id}
						className={` mb-2 cursor-pointer`}
						onClick={() => handleItemClick(id, slug)}
						variant={"default"}
					>
						<ItemMedia variant="image" className="rounded-full border" style={{ backgroundColor: colorCode }} />
						<ItemContent>
							<ItemTitle>{locale === "en" ? titleEn : titleAr}</ItemTitle>
						</ItemContent>
						<ItemActions>
							{isSelected ? <Check className="p-1 rounded-full bg-primary text-primary-foreground" /> : <Circle />}
						</ItemActions>
					</Item>
				)
			})}
		</ScrollArea>
	)
}
