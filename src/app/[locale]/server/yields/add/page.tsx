import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"

import AddYieldForm from "@/forms/AddYieldForm"
import { getAllCattleForSelect } from "@/dl/cattle.data"
import { getAllCattleForSelectType } from "@/types/cattle.type"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

export default async function AddYieldPage() {
	await isAllowedRoles([Role.admin])

	const allCattle: getAllCattleForSelectType = await getAllCattleForSelect()

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف تصافي جديدة"}
			description={"أضف تصافي جديدة الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/yields"
		>
			<AddYieldForm allCattle={allCattle} />
		</ServerPageCard>
	)
}
