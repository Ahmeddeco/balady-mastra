import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"

import { getAllUsersForFarmsPage } from "@/dl/user.data"
import { getAllUsersForFarmsPageType } from "@/types/user.type"
import EditFarmForm from "@/forms/EditFarmForm"
import { getOneFarmForEditPage } from "@/dl/farm.data"
import { getOneFarmForEditPageType } from "@/types/farm.type"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

type Props = {
	params: Promise<{ id: string }>
}

export default async function EditFarmsPage({ params }: Props) {
	await isAllowedRoles([Role.admin])

	const id = (await params).id
	const allUsers: getAllUsersForFarmsPageType = await getAllUsersForFarmsPage()
	const oneFarm: getOneFarmForEditPageType = await getOneFarmForEditPage(id)
	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف مزرعة"}
			description={"عدل بيانات المزرعة في قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/farms"
		>
			<EditFarmForm allUsers={allUsers} farm={oneFarm} />
		</ServerPageCard>
	)
}
