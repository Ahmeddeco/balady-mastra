import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import EditBreedForm from "@/forms/EditBreedForm"
import { getOneBreedForEditPageType } from "@/types/breed.type"
import { getOneBreedForEditPage } from "@/dl/breed.data"

type Props = {
	params: Promise<{ id: string }>
}

export default async function EditFarmsPage({ params }: Props) {
	await isAdmin()
	const id = (await params).id
	const oneBreed: getOneBreedForEditPageType = await getOneBreedForEditPage(id)

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"عدل على السلالة"}
			description={"عدل بيانات السلالة في قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/breeds"
		>
			<EditBreedForm oneBreed={oneBreed} />
		</ServerPageCard>
	)
}
