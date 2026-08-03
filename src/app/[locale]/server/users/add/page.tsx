import { getSession } from "@/auth/getSession"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import ServerPageCard from "@/components/backend/ServerPageCard"
import AddUserForm from "@/forms/AddUserForm"
import { Role } from "@/generated/prisma/enums"
import { CircleChevronLeft } from "lucide-react"

export default async function AddUsersPage() {
	await isAllowedRoles([Role.admin])

	const session = await getSession()
	const authImage = session?.user?.image ?? undefined

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف مستخدم"}
			description={"أضف مستخدم الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/users"
		>
			<AddUserForm authImage={authImage} />
		</ServerPageCard>
	)
}
