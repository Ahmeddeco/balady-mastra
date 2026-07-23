import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import AddUserForm from "../../../../forms/AddUserForm"
import { auth } from "../../../../../auth"
import { isAdmin } from "@/logic/isAdmin"

export default async function AddUsersPage() {
	await isAdmin()

	const session = await auth()
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
