"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { Field, FieldLabel } from "../ui/field"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Input } from "../ui/input"

type Props = {
	allSelectedData:
		| {
				id: string
				title: string
		  }[]
		| undefined
	defaultValues?:
		| {
				id: string
				title: string
		  }[]
		| undefined
	inputName: string
	label: string
}

export default function MultiSelect({ allSelectedData, inputName, label, defaultValues }: Props) {
	const [selected, setSelected] = useState<{ id: string; title: string }[]>(defaultValues || [])
	const selectedIds = selected?.map((item) => item.id) ?? []

	const toggle = (id: string) => {
		setSelected((prev) => {
			if (prev.some((item) => item.id === id)) {
				return prev.filter((item) => item.id !== id)
			}
			const found = allSelectedData?.find((item) => item.id === id)
			return found ? [...prev, found] : prev
		})
	}

	return (
		<Field>
			<Input type="hidden" name={inputName} value={JSON.stringify(selectedIds)} />
			<FieldLabel>{label}</FieldLabel>
			<Card className="w-full ">
				{/* -------------------------------- Badge ------------------------------- */}
				<CardHeader className="flex flex-wrap gap-6">
					{selected.map(({ id, title }) => (
						<Button
							key={id}
							onClick={() => setSelected(selected.filter((item) => item.id !== id))}
							className="cursor-pointer"
							size={"sm"}
						>
							{title}
						</Button>
					))}
				</CardHeader>

				{/* ------------------------------- select ------------------------------- */}
				<CardContent className="flex flex-col gap-3 w-full">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" role="combobox" size={"lg"} type="button" className="justify-start w-fit">
								select {inputName}
								<ChevronDown opacity={0.5} />
							</Button>
						</PopoverTrigger>

						<PopoverContent className="w-[200px] p-0 " align="start">
							<Command>
								<CommandEmpty>No result found.</CommandEmpty>
								<CommandGroup>
									{allSelectedData?.map(({ id, title }) => (
										<CommandItem key={id} onSelect={() => toggle(id)} className="flex items-start gap-4">
											<Check className={selected.some((item) => item.id === id) ? "opacity-100" : "opacity-0"} />
											{title}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</CardContent>
			</Card>
		</Field>
	)
}
