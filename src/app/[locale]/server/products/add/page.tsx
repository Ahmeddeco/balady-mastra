import ServerPageCard from "@/components/backend/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"

import AddProductForm from "@/forms/AddProductForm"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

export default async function AddProductPage() {
	await isAllowedRoles([Role.admin])

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف منتج"}
			description={"أضف منتج الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/products"
		>
			<AddProductForm />
		</ServerPageCard>
	)
}
