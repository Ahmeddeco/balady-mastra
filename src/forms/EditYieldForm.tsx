"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Form from "next/form"
import { useActionState } from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/shared/SubmitButton"
import { addYieldAction } from "@/actions/yield.action"
import YieldSchema from "@/schemas/Yield.schema"
import TiptapEditor from "@/components/shared/TiptapEditor"
import { getAllCattleForSelectType } from "@/types/cattle.type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dateFormat } from "@/logic/dateFormat"
import { getOneYieldForEditPageType } from "@/types/yield.type"

type Props = {
	allCattle: getAllCattleForSelectType
	oneYield: getOneYieldForEditPageType
}

export default function EditYieldForm({ allCattle, oneYield }: Props) {
	const [lastResult, action] = useActionState(addYieldAction, undefined)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: YieldSchema })
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	return (
		<Form id={form.id} action={action} onSubmit={form.onSubmit} className="space-y-6">
			<div className="grid lg:grid-cols-2 grid-cols-1 gap-6 lg:gap-8">
				{/* --------------------------------- cattleId -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.cattleId.name}>الحيوان</FieldLabel>
					<FieldDescription>الربط مع بيانات العجل أو الذبيحة نفسها</FieldDescription>
					<Select key={fields.cattleId.key} name={fields.cattleId.name} defaultValue={oneYield.cattleId}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{allCattle.map(({ createdAt, id, breed, farm }) => (
								<SelectItem value={id} key={id} className="capitalize">
									{dateFormat(createdAt)} - {breed.name} - {farm.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError>{fields.cattleId.errors}</FieldError>
				</Field>

				{/* --------------------------------- hotCarcassWeight -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.hotCarcassWeight.name}>وزن الذبيحة كاملة</FieldLabel>
					<FieldDescription>
						وزن الذبيحة كاملة بعد الذبح والسلخ والتجويف مباشرة (وهي ساخنة قبل التبريد)
					</FieldDescription>
					<Input
						type="number"
						step="any"
						key={fields.hotCarcassWeight.key}
						name={fields.hotCarcassWeight.name}
						defaultValue={oneYield.hotCarcassWeight}
					/>
					<FieldError>{fields.hotCarcassWeight.errors}</FieldError>
				</Field>

				{/* --------------------------------- boneWeight -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.boneWeight.name}>وزن العظام</FieldLabel>
					<FieldDescription>إجمالي وزن العظام الناتجة بعد عملية التشفية</FieldDescription>
					<Input
						type="number"
						step="any"
						key={fields.boneWeight.key}
						name={fields.boneWeight.name}
						defaultValue={oneYield.boneWeight}
					/>
					<FieldError>{fields.boneWeight.errors}</FieldError>
				</Field>

				{/* --------------------------------- fatWeight -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.fatWeight.name}>وزن الدهون</FieldLabel>
					<FieldDescription>وزن الدهون (الدوش، المنديل، والدهون الداخلية) المستخرجة</FieldDescription>
					<Input
						type="number"
						step="any"
						key={fields.fatWeight.key}
						name={fields.fatWeight.name}
						defaultValue={oneYield.fatWeight}
					/>
					<FieldError>{fields.fatWeight.errors}</FieldError>
				</Field>
				{/* --------------------------------- wasteWeight -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.wasteWeight.name}>وزن الهالك</FieldLabel>
					<FieldDescription>
						يشمل الهالك أثناء التقطيع، السوائل المفقودة، أو الأجزاء غير الصالحة للبيع.
					</FieldDescription>
					<Input
						type="number"
						step="any"
						key={fields.wasteWeight.key}
						name={fields.wasteWeight.name}
						defaultValue={oneYield.wasteWeight}
					/>
					<FieldError>{fields.wasteWeight.errors}</FieldError>
				</Field>
				{/* --------------------------------- netYieldWeight -------------------------------- */}
				<Field>
					<FieldLabel htmlFor={fields.netYieldWeight.name}>صافي اللحم الأحمر / المشفي</FieldLabel>
					<FieldDescription>الوزن الصافي للحم الأحمر المخلي تماماً الجاهز للبيع أو التفصيل</FieldDescription>
					<Input
						type="number"
						step="any"
						key={fields.netYieldWeight.key}
						name={fields.netYieldWeight.name}
						defaultValue={oneYield.netYieldWeight}
					/>
					<FieldError>{fields.netYieldWeight.errors}</FieldError>
				</Field>
			</div>

			{/* -------------------------------- report ------------------------------- */}
			<TiptapEditor
				name={fields.report.name}
				label={"تقرير التشفية والملاحظات"}
				editorKey={fields.report.key!}
				defaultValue={oneYield.report!}
				errors={fields.report.errors!}
				description="ملاحظات نصية حول جودة اللحم، درجة التشفية، أو أي تفاصيل خاصة بالذبيحة"
			/>

			{/* ------------------ عرض الأخطاء العامة للفورم إن وجدت ------------------ */}
			{form.errors && <FieldError>{form.errors}</FieldError>}

			{/* ------------------------------ SubmitButton ------------------------------ */}
			<SubmitButton text={"عدل على التصافي"} />
		</Form>
	)
}
