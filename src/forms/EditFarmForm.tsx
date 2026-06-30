"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/shared/SubmitButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editFarmAction } from "@/actions/farm.action"
import FarmSchema from "@/schemas/Farm.Schema"
import { getAllUsersForFarmsPageType } from "@/types/user.type"
import Gps from "@/components/shared/Gps"
import { getOneFarmForEditPageType } from "@/types/farm.type"

type Props = {
	allUsers: getAllUsersForFarmsPageType
	farm: getOneFarmForEditPageType
}

export default function EditFarmForm({ allUsers, farm }: Props) {
	const [lastResult, action] = useActionState(editFarmAction, undefined)
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
				<Input type="hidden" name="id" value={farm.id} />
				{/* --------------------------------- name -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.name.name}>اسم المزرعة</FieldLabel>
					<Input type="text" key={fields.name.key} name={fields.name.name} defaultValue={farm.name} />
					<FieldError>{fields.name.errors}</FieldError>
				</Field>

				{/* --------------------------------- manager -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.userId.name}>المدير المسؤل</FieldLabel>
					<Select key={fields.userId.key} name={fields.userId.name} defaultValue={farm.manager.id ?? ""}>
						<SelectTrigger>
							<SelectValue />
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

			{/* ----------------------------------- Gps ---------------------------------- */}
			<Gps cord={{ lat: Number(farm.lat) || 31, lng: Number(farm.lng) || 30 }} />

			{/* ------------------ عرض الأخطاء العامة للفورم إن وجدت ------------------ */}
			{form.errors && <FieldError>{form.errors}</FieldError>}

			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"عدل بيانات المزرعة"} />
		</Form>
	)
}
