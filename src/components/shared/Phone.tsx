"use client"

import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

type Props = {
	label?: string
	fieldKey?: string
	name: string
	defaultValue: string
	errors: string[] | undefined
}

export default function Phone({ defaultValue, fieldKey, name, errors, label }: Props) {
	const [value, setValue] = useState<string | undefined>(defaultValue ?? undefined)

	return (
		<>
			<Field>
				<FieldLabel htmlFor={name}>{label ?? name}</FieldLabel>
				<Input type="hidden" key={fieldKey} name={name} value={value ?? ""} />
				<PhoneInput
					value={value}
					onChange={setValue}
					defaultCountry="EG"
					inputComponent={Input}
					focusInputOnCountrySelection
				/>
				<FieldError>{errors}</FieldError>
			</Field>
		</>
	)
}
