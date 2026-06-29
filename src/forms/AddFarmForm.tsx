"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/shared/SubmitButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CountryInput from "@/components/shared/CountryInput"
import { addFarmAction } from "@/actions/farm.action"
import FarmSchema from "@/schemas/Farm.Schema"
import { getAllUsersForFarmsPageType } from "@/types/user.type"

type Props = {
	allUsers: getAllUsersForFarmsPageType
}

export default function AddFarmForm({ allUsers }: Props) {
	const [lastResult, action] = useActionState(addFarmAction, undefined)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: FarmSchema })
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			<div className="flex items-center gap-8">
				{/* --------------------------------- name -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.name.name}>اسم المزرعة</FieldLabel>
					<Input type="text" key={fields.name.key} name={fields.name.name} defaultValue={fields.name.initialValue} />
					<FieldError>{fields.name.errors}</FieldError>
				</Field>

				{/* --------------------------------- manager -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.userId.name}>المدير المسؤل</FieldLabel>
					<Select key={fields.userId.key} name={fields.userId.name} defaultValue={fields.userId.initialValue}>
						<SelectTrigger>
							<SelectValue placeholder="" />
						</SelectTrigger>
						<SelectContent>
							{allUsers?.map(({ id, name }) => (
								<SelectItem value={id} key={id}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.userId.errors}</FieldError>
				</Field>
			</div>

			{/* ------------------------------ CountryInput ------------------------------ */}
			<CountryInput cityName={fields.city.name} stateName={fields.state.name} countryName={fields.country.name} />

			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"أضف مزرعة"} />
		</Form>
	)
}
