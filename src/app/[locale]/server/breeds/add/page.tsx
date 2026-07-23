import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import AddBreedForm from "@/forms/AddBreedForm"

export default async function AddFarmsPage() {
	await isAdmin()

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف مزرعة"}
			description={"أضف مزرعة الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/breeds"
		>
			<AddBreedForm />
		</ServerPageCard>
	)
}
