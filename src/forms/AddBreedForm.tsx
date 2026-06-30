"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/shared/SubmitButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addBreedAction } from "@/actions/breed.action"
import BreedSchema from "@/schemas/Breed.Schema"
import CattleTypeSchema from "@/generated/inputTypeSchemas/CattleTypeSchema"
import TiptapEditor from "@/components/shared/TiptapEditor"
import { UploadManyImagesDropZone, UploadOneImagesDropZone } from "@/components/shared/UploadImagesDropZone"

export default function AddBreedForm() {
	const [lastResult, action] = useActionState(addBreedAction, undefined)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: BreedSchema })
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			<div className="flex lg:flex-row flex-col gap-4 items-center">
				{/* --------------------------------- name -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.name.name}>اسم السلالة</FieldLabel>
					<Input type="text" key={fields.name.key} name={fields.name.name} defaultValue={fields.name.initialValue} />
					<FieldError>{fields.name.errors}</FieldError>
				</Field>

				{/* ---------------------------------- type ---------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.type.name}>النوع</FieldLabel>
					<Select key={fields.type.key} name={fields.type.name} defaultValue={CattleTypeSchema.Enum.أبقار}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(CattleTypeSchema.Values).map((type) => (
								<SelectItem value={type} key={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.type.errors}</FieldError>
				</Field>

				{/* ----------------------------- conversionRate ----------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.conversionRate.name}>معدل التحويل الغذائي</FieldLabel>
					<Input
						type="number"
						step="any"
						key={fields.conversionRate.key}
						name={fields.conversionRate.name}
						defaultValue={fields.conversionRate.initialValue}
					/>
					<FieldError>{fields.conversionRate.errors}</FieldError>
				</Field>
			</div>

			{/* ------------------------------- description ------------------------------ */}
			<TiptapEditor
				name={fields.description.name}
				label={"الوصف الدقيق للنوع"}
				editorKey={fields.description.key!}
				defaultValue={fields.description.initialValue!}
				errors={fields.description.errors!}
			/>

			{/* ---------------------------------- image --------------------------------- */}
			<UploadOneImagesDropZone
				label={"صورة رئيسية للسلالة"}
				errors={fields.image.errors}
				imageName={fields.image.name}
				imageKey={fields.image.key}
			/>

			{/* --------------------------------- images --------------------------------- */}
			<UploadManyImagesDropZone
				label={"صور إضافية للسلالة"}
				imageKey={fields.images.key}
				errors={fields.images.errors}
				imagesName={fields.images.name}
			/>

			{/* ------------------ عرض الأخطاء العامة للفورم إن وجدت ------------------ */}
			{form.errors && <FieldError>{form.errors}</FieldError>}

			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"أضف سلالة"} />
		</Form>
	)
}
