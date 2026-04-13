import Form from "next/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Category } from "@/generated/prisma/enums"

type Props = {
	activeCategory: Category | undefined
}
export default function ProductFilter({ activeCategory }: Props) {
	return (
		<div className="flex items-center  gap-2">
			<Form action={""}>
				<Button type="submit" variant={activeCategory === undefined ? "default" : "ghost"} size={"sm"}>
					all
				</Button>
			</Form>

			{Object.values(Category).map((category, index) => (
				<Form action={""} key={index} className="p-x-2">
					<Input type="hidden" name="category" value={category ?? ""} />
					<Button type="submit" variant={activeCategory === category ? "default" : "ghost"} size={"sm"}>
						{category}
					</Button>
				</Form>
			))}
		</div>
	)
}
