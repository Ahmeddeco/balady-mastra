import EmptyCard from "@/components/shared/EmptyCard"
import ServerPageCard from "@/components/shared/ServerPageCard"
import { getAllCattleForSelect } from "@/dl/cattle.data"
import { getOneYieldForEditPage } from "@/dl/yield.data"
import EditYieldForm from "@/forms/EditYieldForm"
import { isAdmin } from "@/logic/isAdmin"
import { getAllCattleForSelectType } from "@/types/cattle.type"
import { getOneYieldForEditPageType } from "@/types/yield.type"
import { CircleChevronLeft, PlusCircle } from "lucide-react"

export default async function EditYieldPage({ params }: { params: Promise<{ id: string }> }) {
	await isAdmin()

	const id = (await params).id
	const oneYield: getOneYieldForEditPageType = await getOneYieldForEditPage(id)
	const allCattle: getAllCattleForSelectType = await getAllCattleForSelect()

	return !oneYield ? (
		<EmptyCard href={"/server/yields/add"} linkTitle={"أضف تصافي جديدة"} linkIcon={PlusCircle} />
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
