import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import { getAllBreedForSelectType } from "@/types/breed.type"
import { getAllBreedForSelect } from "@/dl/breed.data"
import EditCattleForm from "@/forms/EditCattleForm"
import { getAllFarmsForSelectType } from "@/types/farm.type"
import { getAllFarmsForSelect } from "@/dl/farm.data"
import { getOneCattleForEditPage } from "@/dl/cattle.data"
import { getOneCattleForEditPageType } from "@/types/cattle.type"

type Props = {
	params: Promise<{ id: string }>
}

export default async function EditFarmsPage({ params }: Props) {
	await isAdmin()
	const id = (await params).id
	const breeds: getAllBreedForSelectType = await getAllBreedForSelect()
	const farms: getAllFarmsForSelectType = await getAllFarmsForSelect()
	const oneCattle: getOneCattleForEditPageType = await getOneCattleForEditPage(id)

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف حيوان"}
			description={"أضف حيوان الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/cattle"
		>
			<EditCattleForm breeds={breeds} farms={farms} oneCattle={oneCattle} />
		</ServerPageCard>
	)
}
