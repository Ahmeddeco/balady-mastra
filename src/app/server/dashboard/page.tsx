import { isAdmin } from "@/logic/isAdmin"

export default async function DashboardPage() {
	await isAdmin()

	return <h1>Welcome to Dashboardpage!</h1>
}
