"use client"

import { Check, Circle } from "lucide-react"
import { Button } from "../ui/button"

type SortByProps = {
	titleAr: string
	titleEn: string
	value: string
	selectedValue: string
	onSelect: (value: string) => void
	locale: "ar" | "en"
}

export default function SortBy({ titleAr, titleEn, value, selectedValue, onSelect, locale }: SortByProps) {
	// فحص ما إذا كان هذا العنصر بالتحديد هو المختار حالياً
	const isSelected = selectedValue === value

	return (
		<Button
			size={"full"}
			className="mb-2 justify-between"
			variant={"ghost"}
			type="button"
			onClick={() => onSelect(isSelected ? "" : value)} // إذا ضغط عليه وهو مختار يلغى التحديد، وإذا لم يكن مختاراً يحدده ويلغي الباقي
		>
			{locale === "en" ? titleEn : titleAr}
			{isSelected ? <Check className="p-1 rounded-full bg-primary text-primary-foreground" /> : <Circle />}
		</Button>
	)
}
