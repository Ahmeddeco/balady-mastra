"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState, useState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UploadManyImagesDropZone, UploadOneImagesDropZone } from "@/components/shared/UploadImagesDropZone"
import SubmitButton from "@/components/shared/SubmitButton"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Phone from "@/components/shared/Phone"
import CountryInput from "@/components/shared/CountryInput"
import { Category, Role, Unit } from "@/generated/prisma/enums"
import { addUserAction } from "@/actions/user.action"
import UserSchema from "@/schemas/UserSchema"
import { addProductAction } from "@/actions/product.action "
import ProductSchema from "@/schemas/ProductSchema"
import { createSlug } from "@/logic/slug"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"

export default function AddProductForm() {
	const [lastResult, action] = useActionState(addProductAction, undefined)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProductSchema })
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	const [slug, setSlug] = useState("")

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			{/* --------------------------------- title -------------------------------- */}
			<Field>
				<FieldLabel htmlFor={fields.title.name}>الاسم بالكامل</FieldLabel>
				<Input
					type="text"
					key={fields.title.key}
					name={fields.title.name}
					defaultValue={fields.title.initialValue}
					onChange={(event) => {
						const newSlug = createSlug(event.target.value)
						setSlug(newSlug)
					}}
				/>
				<FieldError>{fields.title.errors}</FieldError>
			</Field>

			{/* ---------------------------------- slug ---------------------------------- */}
			<Field>
				<FieldLabel htmlFor={fields.slug.name}>الاسم المستعار</FieldLabel>
				<Input
					type="text"
					key={fields.slug.key}
					name={fields.slug.name}
					defaultValue={fields.slug.initialValue}
					value={slug}
					readOnly
				/>
				<FieldError>{fields.slug.errors}</FieldError>
			</Field>

			{/* ----------------------------- description ----------------------------- */}
			<Field>
				<FieldLabel htmlFor={fields.description.name}>وصف المنتج</FieldLabel>
				<Textarea
					key={fields.description.key}
					name={fields.description.name}
					defaultValue={fields.description.initialValue}
				/>
				<FieldError>{fields.description.errors}</FieldError>
			</Field>

			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				{/* ------------------------------- specialCut ------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.specialCut.name}>قطعية ممتازة ؟</FieldLabel>
					<Switch
						key={fields.specialCut.key}
						name={fields.specialCut.name}
						defaultValue={fields.specialCut.initialValue}
					/>
					<FieldError>{fields.specialCut.errors}</FieldError>
				</Field>

				{/* ------------------------------- isActive ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.isActive.name}>حالة النشر</FieldLabel>
					<Switch key={fields.isActive.key} name={fields.isActive.name} defaultValue={fields.isActive.initialValue} />
					<FieldError>{fields.isActive.errors}</FieldError>
				</Field>
			</div>

			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				{/* -------------------------------- category -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.category.name}>الفئة</FieldLabel>
					<Select key={fields.category.key} name={fields.category.name} defaultValue={Category.MEAT}>
						<SelectTrigger>
							<SelectValue placeholder={Category.MEAT} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(Category).map((degreeProgram) => (
								<SelectItem value={degreeProgram} key={degreeProgram}>
									{degreeProgram}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.category.errors}</FieldError>
				</Field>

				{/* ---------------------------------- unit ---------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.unit.name}>الوحدة</FieldLabel>
					<Select key={fields.unit.key} name={fields.unit.name} defaultValue={Unit.KG}>
						<SelectTrigger>
							<SelectValue placeholder={Unit.KG} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(Unit).map((degreeProgram) => (
								<SelectItem value={degreeProgram} key={degreeProgram}>
									{degreeProgram}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.unit.errors}</FieldError>
				</Field>
			</div>

			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				{/* ---------------------------------- price --------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.price.name}>السعر</FieldLabel>
					<Input
						type="number"
						key={fields.price.key}
						name={fields.price.name}
						defaultValue={fields.price.initialValue}
					/>
					<FieldError>{fields.price.errors}</FieldError>
				</Field>

				{/* ------------------------------- discount ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.discount.name}>الخصم</FieldLabel>
					<Input
						type="number"
						key={fields.discount.key}
						name={fields.discount.name}
						defaultValue={fields.discount.initialValue}
					/>
					<FieldError>{fields.discount.errors}</FieldError>
				</Field>

				{/* ------------------------------- quantity ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.quantity.name}>الكمية</FieldLabel>
					<Input
						type="number"
						key={fields.quantity.key}
						name={fields.quantity.name}
						defaultValue={fields.quantity.initialValue}
					/>
					<FieldError>{fields.quantity.errors}</FieldError>
				</Field>

				{/* ------------------------------- lowQuantity ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.lowQuantity.name}>الحد الأدنى للكمية</FieldLabel>
					<Input
						type="number"
						key={fields.lowQuantity.key}
						name={fields.lowQuantity.name}
						defaultValue={fields.lowQuantity.initialValue}
					/>
					<FieldError>{fields.lowQuantity.errors}</FieldError>
				</Field>
			</div>

			{/* ------------------------------ mainImage ------------------------------ */}
			<UploadOneImagesDropZone
				imageName={fields.mainImage.name}
				imageKey={fields.mainImage.key}
				errors={fields.mainImage.errors}
				label="صورة البانر"
			/>
			{/* -------------------------------- images ------------------------------- */}
			<UploadManyImagesDropZone
				imageName={fields.images.name}
				imageKey={fields.images.key}
				errors={fields.images.errors}
				label="صور المنتج"
			/>
			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"أضف منتج"} />
		</Form>
	)
}
