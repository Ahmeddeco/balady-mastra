import ServerPageCard from "@/components/backend/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"

import AddBreedForm from "@/forms/AddBreedForm"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

export default async function AddFarmsPage() {
	await isAllowedRoles([Role.admin])

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف مزرعة"}
			description={"أضف مزرعة الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/breeds"
		>
			<AddBreedForm />
		</ServerPageCard>
	)
}
