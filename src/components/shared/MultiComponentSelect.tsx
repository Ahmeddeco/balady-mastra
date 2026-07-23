/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Check, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Card, CardContent, CardHeader } from "../ui/card"

type Props = {
	allSelectedData: { id: string; title: string }[] | undefined
	errors: string[] | undefined
	defaultValues?: any[] | undefined // دعم التركيبة القادمة من قاعدة البيانات
	label: string
	onSelectionChange?: (selected: { id: string; title: string }[]) => void
}

export default function MultiComponentSelect({
	allSelectedData,
	label,
	defaultValues,
	errors,
	onSelectionChange,
}: Props) {
	// الـ State يحتاج لتخزين كائنات كاملة { id, title } ليتمكن من عرضها
	const computeInitialSelected = () => {
		if (defaultValues && allSelectedData) {
			return (
				(defaultValues
					.map((def) => {
						// البحث عن الـ id سواء كان ممرراً كـ id أو componentId
						const targetId = def.id || def.componentId
						return allSelectedData.find((item) => item.id === targetId)
					})
					.filter(Boolean) as { id: string; title: string }[]) || []
			)
		}

		return [] as { id: string; title: string }[]
	}

	const [selected, setSelected] = useState<{ id: string; title: string }[]>(() => computeInitialSelected())

	// notify parent once on mount with the initial selection (if any)
	useEffect(() => {
		if (onSelectionChange && selected.length > 0) {
			onSelectionChange(selected)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const toggle = (id: string) => {
		let updated: { id: string; title: string }[] = []

		if (selected.some((item) => item.id === id)) {
			updated = selected.filter((item) => item.id !== id)
		} else {
			const found = allSelectedData?.find((item) => item.id === id)
			updated = found ? [...selected, found] : selected
		}

		setSelected(updated)
		if (onSelectionChange) {
			onSelectionChange(updated)
		}
	}

	const remove = (id: string) => {
		const updated = selected.filter((item) => item.id !== id)
		setSelected(updated)
		if (onSelectionChange) {
			onSelectionChange(updated)
		}
	}

	return (
		<Field>
			<FieldLabel>{label}</FieldLabel>
			<Card className="w-full">
				{selected.length > 0 && (
					<CardHeader className="flex flex-row flex-wrap gap-2 pb-3">
						{selected.map(({ id, title }) => (
							<Button key={id} onClick={() => remove(id)} size={"sm"} type="button" variant="secondary">
								{title} <X className="size-3 ms-1" />
							</Button>
						))}
					</CardHeader>
				)}

				<CardContent className="flex flex-col gap-6 w-full pt-4">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" role="combobox" size={"lg"} type="button" className="justify-between w-full">
								<span>اختر المواد الفعالة</span>
								<ChevronDown opacity={0.5} className="size-4" />
							</Button>
						</PopoverTrigger>

						<PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
							<Command>
								<CommandEmpty>No result found.</CommandEmpty>
								<CommandGroup>
									{allSelectedData?.map(({ id, title }) => (
										<CommandItem
											key={id}
											onSelect={() => toggle(id)}
											className="flex items-center justify-between cursor-pointer"
										>
											<span>{title}</span>
											<Check
												className={
													selected.some((item) => item.id === id) ? "opacity-100 size-4 text-primary" : "opacity-0"
												}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</CardContent>
			</Card>
			<FieldError>{errors}</FieldError>
		</Field>
	)
}
