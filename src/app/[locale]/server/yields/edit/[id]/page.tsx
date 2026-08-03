import { isAllowedRoles } from "@/auth/isAllowedRoles"
import EmptyCard from "@/components/shared/EmptyCard"
import ServerPageCard from "@/components/backend/ServerPageCard"
import { getAllCattleForSelect } from "@/dl/cattle.data"
import { getOneYieldForEditPage } from "@/dl/yield.data"
import EditYieldForm from "@/forms/EditYieldForm"
import { Role } from "@/generated/prisma/enums"

import { getAllCattleForSelectType } from "@/types/cattle.type"
import { getOneYieldForEditPageType } from "@/types/yield.type"
import { CircleChevronLeft } from "lucide-react"

export default async function EditYieldPage({ params }: { params: Promise<{ id: string }> }) {
	await isAllowedRoles([Role.admin])

	const id = (await params).id
	const oneYield: getOneYieldForEditPageType = await getOneYieldForEditPage(id)
	const allCattle: getAllCattleForSelectType = await getAllCattleForSelect()

	return !oneYield ? (
		<EmptyCard href={"/server/yields/add"} linkTitle={"أضف تصافي جديدة"} />
	) : (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"عدل التصافي"}
			description={"عدل التصافي في قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/yields"
		>
			<EditYieldForm oneYield={oneYield} allCattle={allCattle} />
		</ServerPageCard>
	)
}
