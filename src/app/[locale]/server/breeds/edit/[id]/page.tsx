import ServerPageCard from "@/components/backend/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"

import EditBreedForm from "@/forms/EditBreedForm"
import { getOneBreedForEditPageType } from "@/types/breed.type"
import { getOneBreedForEditPage } from "@/dl/breed.data"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

type Props = {
	params: Promise<{ id: string }>
}

export default async function EditFarmsPage({ params }: Props) {
	await isAllowedRoles([Role.admin])

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
