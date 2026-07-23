import { isAdmin } from "@/logic/isAdmin"

export default async function ChartsPage() {
	await isAdmin()

	return <h1>Welcome to Charts page!</h1>
}
