"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UploadManyImagesDropZone, UploadOneImagesDropZone } from "@/components/shared/UploadImagesDropZone"
import SubmitButton from "@/components/shared/SubmitButton"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category, Unit } from "@/generated/prisma/enums"
import { addProductAction } from "@/actions/product.action"
import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import ProductSchema from "@/schemas/Product.Schema"

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

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			{/* --------------------------------- title -------------------------------- */}
			<Field>
				<FieldLabel htmlFor={fields.title.name}>اسم المنتج</FieldLabel>
				<Input type="text" key={fields.title.key} name={fields.title.name} defaultValue={fields.title.initialValue} />
				<FieldError>{fields.title.errors}</FieldError>
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
				{/* --------------------------------- cut -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.cut.name}>القطعية</FieldLabel>
					<Select key={fields.cut.key} name={fields.cut.name} defaultValue={MeatTypeSchema.Enum.chuck}>
						<SelectTrigger>
							<SelectValue placeholder={MeatTypeSchema.Enum.chuck} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(MeatTypeSchema.Values).map((cut) => (
								<SelectItem value={cut} key={cut}>
									{cut}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.cut.errors}</FieldError>
				</Field>

				{/* -------------------------------- category -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.category.name}>الفئة</FieldLabel>
					<Select key={fields.category.key} name={fields.category.name} defaultValue={Category.meat}>
						<SelectTrigger>
							<SelectValue placeholder={Category.meat} />
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
					<Select key={fields.unit.key} name={fields.unit.name} defaultValue={Unit.kg}>
						<SelectTrigger>
							<SelectValue placeholder={Unit.kg} />
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

				{/* ---------------------------------- price --------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.price.name}>السعر</FieldLabel>
					<Input
						type="number"
						step="any"
						key={fields.price.key}
						name={fields.price.name}
						defaultValue={fields.price.initialValue}
					/>
					<FieldError>{fields.price.errors}</FieldError>
				</Field>
			</div>

			<div className="flex lg:flex-row flex-col items-center justify-center gap-4">
				{/* ------------------------------- discount ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.discount.name}>الخصم</FieldLabel>
					<Input
						type="number"
						step="any"
						key={fields.discount.key}
						name={fields.discount.name}
						defaultValue={fields.discount.initialValue}
					/>
					<FieldError>{fields.discount.errors}</FieldError>
				</Field>

				{/* ------------------------------- stock ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.stock.name}>الكمية</FieldLabel>
					<Input
						type="number"
						step="any"
						key={fields.stock.key}
						name={fields.stock.name}
						defaultValue={fields.stock.initialValue}
					/>
					<FieldError>{fields.stock.errors}</FieldError>
				</Field>

				{/* ------------------------------- lowQuantity ------------------------------ */}
				<Field>
					<FieldLabel htmlFor={fields.lowQuantity.name}>الحد الأدنى للكمية</FieldLabel>
					<Input
						type="number"
						step="any"
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

			{/* عرض الأخطاء العامة للفورم إن وجدت */}
			{form.errors && <FieldError>{form.errors}</FieldError>}

			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"أضف منتج"} />
		</Form>
	)
}
