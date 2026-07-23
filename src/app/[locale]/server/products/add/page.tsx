import ServerPageCard from "@/components/shared/ServerPageCard"
import { CircleChevronLeft } from "lucide-react"
import { isAdmin } from "@/logic/isAdmin"
import AddProductForm from "@/forms/AddProductForm"

export default async function AddProductPage() {
	await isAdmin()

	return (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"أضف منتج"}
			description={"أضف منتج الى قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/products"
		>
			<AddProductForm />
		</ServerPageCard>
	)
}
