import { isAllowedRoles } from "@/auth/isAllowedRoles"
import EmptyCard from "@/components/shared/EmptyCard"
import ServerPageCard from "@/components/shared/ServerPageCard"
import { getOneProductById } from "@/dl/products.data"
import EditProductForm from "@/forms/EditProductForm"
import { Role } from "@/generated/prisma/enums"
import { getOneProductByIdType } from "@/types/Product.type"
import { CircleChevronLeft } from "lucide-react"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
	await isAllowedRoles([Role.admin])

	const id = (await params).id
	const product: getOneProductByIdType = await getOneProductById(id)

	return !product ? (
		<EmptyCard href={"/server/products/add"} linkTitle={"أضف منتج"} />
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
