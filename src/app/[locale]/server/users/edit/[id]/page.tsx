import { isAllowedRoles } from "@/auth/isAllowedRoles"
import EmptyCard from "@/components/shared/EmptyCard"
import ServerPageCard from "@/components/shared/ServerPageCard"
import { getOneUser } from "@/dl/user.data"
import EditUserForm from "@/forms/EditUserForm"
import { Role } from "@/generated/prisma/enums"

import { CircleChevronLeft } from "lucide-react"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
	await isAllowedRoles([Role.admin])

	const id = (await params).id
	const user = await getOneUser(id)

	return !user ? (
		<EmptyCard href={"/server/users/add"} linkTitle={"أضف مستخدم جديد"} />
	) : (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"عدل المستخدم"}
			description={"عدل المستخدم في قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/users"
		>
			<EditUserForm user={user!} />
		</ServerPageCard>
	)
}
