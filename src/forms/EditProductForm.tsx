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
import { addProductAction, editProductAction } from "@/actions/product.action "
import ProductSchema, { Product } from "@/schemas/ProductSchema"
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

type Props = {
	product:
		| {
				id: string
				title: string
				slug: string
				description: string
				specialCut: boolean | null
				category: Category
				mainImage: string
				images: string[]
				price: number
				discount: number | null
				unit: Unit | null
				increaseByOne: boolean | null
				quantity: number
				lowQuantity: number | null
				createdAt: Date
				updatedAt: Date
				isActive: boolean | null
		  }
		| null
		| undefined
}

export default function EditProductForm({ product }: Props) {
	const [lastResult, action] = useActionState(editProductAction, undefined)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProductSchema })
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	const [slug, setSlug] = useState(product?.slug ?? "")

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			<Input type="hidden" name="id" value={product?.id} />

			{/* --------------------------------- title -------------------------------- */}
			<Field>
				<FieldLabel htmlFor={fields.title.name}>الاسم بالكامل</FieldLabel>
				<Input
					type="text"
					key={fields.title.key}
					name={fields.title.name}
					defaultValue={product?.title}
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
				<Input type="text" key={fields.slug.key} name={fields.slug.name} value={slug} readOnly />
				<FieldError>{fields.slug.errors}</FieldError>
			</Field>

			{/* ----------------------------- description ----------------------------- */}
			<Field>
				<FieldLabel htmlFor={fields.description.name}>وصف المنتج</FieldLabel>
				<Textarea key={fields.description.key} name={fields.description.name} defaultValue={product?.description} />
				<FieldError>{fields.description.errors}</FieldError>
			</Field>

			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				{/* ------------------------------- specialCut ------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.specialCut.name}>قطعية ممتازة ؟</FieldLabel>
					<Switch
						key={fields.specialCut.key}
						name={fields.specialCut.name}
						defaultChecked={product?.specialCut ?? false}
					/>
					<FieldError>{fields.specialCut.errors}</FieldError>
				</Field>

				{/* ------------------------------- isActive ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.isActive.name}>حالة النشر</FieldLabel>
					<Switch key={fields.isActive.key} name={fields.isActive.name} defaultChecked={product?.isActive ?? false} />
					<FieldError>{fields.isActive.errors}</FieldError>
				</Field>
			</div>

			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				{/* -------------------------------- category -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.category.name}>الفئة</FieldLabel>
					<Select key={fields.category.key} name={fields.category.name} defaultValue={product?.category}>
						<SelectTrigger>
							<SelectValue />
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
					<Select key={fields.unit.key} name={fields.unit.name} defaultValue={product?.unit ?? Unit.KG}>
						<SelectTrigger>
							<SelectValue />
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
					<Input type="number" key={fields.price.key} name={fields.price.name} defaultValue={product?.price} />
					<FieldError>{fields.price.errors}</FieldError>
				</Field>

				{/* ------------------------------- discount ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.discount.name}>الخصم</FieldLabel>
					<Input
						type="number"
						key={fields.discount.key}
						name={fields.discount.name}
						defaultValue={product?.discount ?? 0}
					/>
					<FieldError>{fields.discount.errors}</FieldError>
				</Field>

				{/* ------------------------------- quantity ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.quantity.name}>الكمية</FieldLabel>
					<Input type="number" key={fields.quantity.key} name={fields.quantity.name} defaultValue={product?.quantity} />
					<FieldError>{fields.quantity.errors}</FieldError>
				</Field>

				{/* ------------------------------- lowQuantity ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.lowQuantity.name}>الحد الأدنى للكمية</FieldLabel>
					<Input
						type="number"
						key={fields.lowQuantity.key}
						name={fields.lowQuantity.name}
						defaultValue={product?.lowQuantity ?? 0}
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
				dbImage={product?.mainImage}
			/>
			{/* -------------------------------- images ------------------------------- */}
			<UploadManyImagesDropZone
				imageName={fields.images.name}
				imageKey={fields.images.key}
				errors={fields.images.errors}
				label="صور المنتج"
				dbImages={product?.images}
			/>
			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"تعديل المنتج"} />
		</Form>
	)
}
