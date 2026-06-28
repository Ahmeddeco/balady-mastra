import EmptyCard from "@/components/shared/EmptyCard"
import ServerPageCard from "@/components/shared/ServerPageCard"
import { getOneProductById } from "@/dl/products.data"
import EditProductForm from "@/forms/EditProductForm"
import { isAdmin } from "@/logic/isAdmin"
import { getOneProductByIdType } from "@/types/Product.type"
import { CircleChevronLeft, PlusCircle } from "lucide-react"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
	await isAdmin()
	const id = (await params).id
	const product:getOneProductByIdType = await getOneProductById(id)

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
