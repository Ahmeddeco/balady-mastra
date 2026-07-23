"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import { Category } from "@/generated/prisma/enums"

type Props = {
	activeCategory: Category | undefined
}

export default function ProductFilter({ activeCategory }: Props) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const currentQuery = useMemo(() => {
		return new URLSearchParams(searchParams.toString())
	}, [searchParams])

	const navigateToCategory = (category?: Category) => {
		const params = new URLSearchParams(currentQuery.toString())

		if (category) {
			params.set("category", category)
		} else {
			params.delete("category")
		}

		const target = `/products${params.toString() ? `?${params.toString()}` : ""}`
		const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

		if (target === current) return

		router.replace(target)
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				onClick={() => navigateToCategory(undefined)}
				variant={activeCategory === undefined ? "default" : "ghost"}
				size="sm"
			>
				all
			</Button>

			{Object.values(Category).map((category, index) => (
				<Button
					key={index}
					onClick={() => navigateToCategory(category)}
					variant={activeCategory === category ? "default" : "ghost"}
					size="sm"
				>
					{category}
				</Button>
			))}
		</div>
	)
}
