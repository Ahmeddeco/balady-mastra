import { isAllowedRoles } from "@/auth/isAllowedRoles"
import { Role } from "@/generated/prisma/enums"

export default async function ChartsPage() {
	await isAllowedRoles([Role.admin])

	return <h1>Welcome to Charts page!</h1>
}
