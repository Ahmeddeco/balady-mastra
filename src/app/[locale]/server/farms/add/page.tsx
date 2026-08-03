import ServerPageCard from "@/components/backend/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"

import AddFarmForm from "@/forms/AddFarmForm"
import { getAllUsersForFarmsPage } from "@/dl/user.data"
import { getAllUsersForFarmsPageType } from "@/types/user.type"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

export default async function AddFarmsPage() {
	await isAllowedRoles([Role.admin])

	const allUsers: getAllUsersForFarmsPageType = await getAllUsersForFarmsPage()

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف مزرعة"}
			description={"أضف مزرعة الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/farms"
		>
			<AddFarmForm allUsers={allUsers} />
		</ServerPageCard>
	)
}
