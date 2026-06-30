import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import AddCattleForm from "@/forms/AddCattleForm"
import { getAllBreedForSelect } from "@/dl/breed.data"
import { getAllBreedForSelectType } from "@/types/breed.type"
import { getAllFarmsForSelect } from "@/dl/farm.data"
import { getAllFarmsForSelectType } from "@/types/farm.type"

export default async function AddFarmsPage() {
	await isAdmin()
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
