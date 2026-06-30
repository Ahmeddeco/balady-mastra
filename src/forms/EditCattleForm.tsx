"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UploadManyImagesDropZone, UploadOneImagesDropZone } from "@/components/shared/UploadImagesDropZone"
import SubmitButton from "@/components/shared/SubmitButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditCattleAction } from "@/actions/cattle.action"
import CattleSchema from "@/schemas/Cattle.Schema"
import AgeSchema from "@/generated/inputTypeSchemas/AgeSchema"
import { getAllBreedForSelectType } from "@/types/breed.type"
import { getAllFarmsForSelectType } from "@/types/farm.type"
import TiptapEditor from "@/components/shared/TiptapEditor"
import GenderSchema from "@/generated/inputTypeSchemas/GenderSchema"
import { getOneCattleForEditPageType } from "@/types/cattle.type"

type Props = {
	breeds: getAllBreedForSelectType
	farms: getAllFarmsForSelectType
	oneCattle: getOneCattleForEditPageType
}

export default function EditCattleForm({ breeds, farms, oneCattle }: Props) {
	const [lastResult, action] = useActionState(EditCattleAction, undefined)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CattleSchema })
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			<div className="grid lg:grid-cols-3 grid-cols-2 items-center gap-6">
				<Input type="hidden" name="id" value={oneCattle.id} />
				{/* ----------------------------------- farm ---------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.farmId.name}>المزرعة</FieldLabel>
					<Select key={fields.farmId.key} name={fields.farmId.name} defaultValue={oneCattle.farmId}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{farms.map(({ id, name }) => (
								<SelectItem value={id} key={id}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.farmId.errors}</FieldError>
				</Field>

				{/* -------------------------------- breedId -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.breedId.name}>السلالة</FieldLabel>
					<Select key={fields.breedId.key} name={fields.breedId.name} defaultValue={oneCattle.breedId}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{breeds.map(({ id, name }) => (
								<SelectItem value={id} key={id}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.breedId.errors}</FieldError>
				</Field>

				{/* -------------------------------- age -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.age.name}>العمر</FieldLabel>
					<Select key={fields.age.key} name={fields.age.name} defaultValue={oneCattle.age}>
						<SelectTrigger>
							<SelectValue placeholder={AgeSchema.Enum.young} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(AgeSchema.Enum).map((age) => (
								<SelectItem value={age} key={age}>
									{age}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.age.errors}</FieldError>
				</Field>

				{/* ---------------------------------- gender ---------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.gender.name}>الجنس</FieldLabel>
					<Select key={fields.gender.key} name={fields.gender.name} defaultValue={oneCattle.gender}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(GenderSchema.Enum).map((degreeProgram) => (
								<SelectItem value={degreeProgram} key={degreeProgram}>
									{degreeProgram}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.gender.errors}</FieldError>
				</Field>

				{/* ---------------------------------- costPrice --------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.costPrice.name}>سعر التكلفة</FieldLabel>
					<Input
						type="number"
						step="any"
						key={fields.costPrice.key}
						name={fields.costPrice.name}
						defaultValue={String(oneCattle.costPrice)}
					/>
					<FieldError>{fields.costPrice.errors}</FieldError>
				</Field>

				{/* ------------------------------ الوزن القائم ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.liveWeight.name}>الوزن القائم </FieldLabel>
					<Input
						type="number"
						step="any"
						key={fields.liveWeight.key}
						name={fields.liveWeight.name}
						defaultValue={String(oneCattle.liveWeight)}
					/>
					<FieldError>{fields.liveWeight.errors}</FieldError>
				</Field>
			</div>

			{/* ----------------------------- description ----------------------------- */}
			<TiptapEditor
				name={fields.description.name}
				editorKey={fields.description.key!}
				label={"الوصف التفصيلي للحيوان"}
				errors={fields.description.errors!}
				defaultValue={oneCattle.description ?? ""}
			/>

			{/* ------------------------------ image ------------------------------ */}
			<UploadOneImagesDropZone
				imageName={fields.image.name}
				imageKey={fields.image.key}
				errors={fields.image.errors}
				label="الصورة الرئيسية للحيوان"
				dbImage={oneCattle.image ?? "/images/noImage.svg"}
			/>
			{/* -------------------------------- images ------------------------------- */}
			<UploadManyImagesDropZone
				imageName={fields.images.name}
				imageKey={fields.images.key}
				errors={fields.images.errors}
				label="الصور الأخرى للحيوان"
				dbImages={oneCattle.images ?? "/images/noImage.svg"}
			/>

			{/* عرض الأخطاء العامة للفورم إن وجدت */}
			{form.errors && <FieldError>{form.errors}</FieldError>}
			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"عدل على بينات الحيوان"} />
		</Form>
	)
}
