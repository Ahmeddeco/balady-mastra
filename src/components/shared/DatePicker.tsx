"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "../ui/input"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { useState } from "react"

type Props = {
	name: string | undefined
	key: string | undefined
	defaultValue: string | undefined
	errors: string[] | undefined
}

export default function DatePicker({ defaultValue, key, name, errors }: Props) {
	const [date, setDate] = useState<Date | undefined>(() => {
		const d = defaultValue ? new Date(defaultValue) : undefined
		return d && !isNaN(d.getTime()) ? d : undefined
	})
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [open, setOpen] = useState(false)

	return (
		<Field>
			<FieldLabel htmlFor={name}>{name}</FieldLabel>
			<Popover>
				<Input type="hidden" key={key} name={name} defaultValue={defaultValue} value={date ? date.toISOString() : ""} />
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						data-empty={!date}
						className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
					>
						<CalendarIcon />
						{date ? (
							date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
						) : (
							<h6>Pick a Date</h6>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						captionLayout="dropdown"
						onSelect={(date) => {
							setDate(date)
							setOpen(false)
						}}
					/>
				</PopoverContent>
			</Popover>
			<FieldError>{errors}</FieldError>
		</Field>
	)
}
