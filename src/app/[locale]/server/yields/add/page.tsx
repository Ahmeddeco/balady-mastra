import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import AddYieldForm from "@/forms/AddYieldForm"
import { getAllCattleForSelect } from "@/dl/cattle.data"
import { getAllCattleForSelectType } from "@/types/cattle.type"

export default async function AddYieldPage() {
	await isAdmin()
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
