import EmptyCard from "@/components/shared/EmptyCard"
import ServerPageCard from "@/components/shared/ServerPageCard"
import { getOneProduct } from "@/dl/products.data"
import EditProductForm from "@/forms/EditProductForm"
import { isAdmin } from "@/logic/isAdmin"
import { CircleChevronLeft, PlusCircle } from "lucide-react"

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
	await isAdmin()

	const slug = (await params).slug
	const product = await getOneProduct(slug)

	return !product ? (
		<EmptyCard href={"/server/products/add"} linkTitle={"أضف منتج"} linkIcon={PlusCircle} />
	) : (
		<ServerPageCard
			icon={CircleChevronLeft}
			title={"عدل المنتج"}
			description={"عدل المنتج في قاعدة البيانات."}
			btnTitle={"الرجوع"}
			href="/server/products"
		>
			<EditProductForm product={product} />
		</ServerPageCard>
	)
}
