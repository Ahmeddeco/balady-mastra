import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import AddCattleForm from "@/forms/AddCattleForm"
import { getAllBreedForSelect } from "@/dl/breed.data"
import { getAllBreedForSelectType } from "@/types/breed.type"
import { getAllFarmsForSelect } from "@/dl/farm.data"
import { getAllFarmsForSelectType } from "@/types/farm.type"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

export default async function AddFarmsPage() {
	await isAllowedRoles([Role.admin])

	const breeds: getAllBreedForSelectType = await getAllBreedForSelect()
	const farms: getAllFarmsForSelectType = await getAllFarmsForSelect()

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف حيوان"}
			description={"أضف حيوان الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/cattle"
		>
			<AddCattleForm breeds={breeds} farms={farms} />
		</ServerPageCard>
	)
}
