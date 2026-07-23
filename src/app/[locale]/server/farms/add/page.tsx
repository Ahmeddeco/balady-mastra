import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import AddFarmForm from "@/forms/AddFarmForm"
import { getAllUsersForFarmsPage } from "@/dl/user.data"
import { getAllUsersForFarmsPageType } from "@/types/user.type"

export default async function AddFarmsPage() {
	await isAdmin()
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
