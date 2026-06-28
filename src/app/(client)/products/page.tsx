import { auth } from "../../../../auth"
import ProductCard from "@/components/shared/ProductCard"
import ProductFilter from "@/components/shared/ProductFilter"
import { getAllProductsForProductsPage } from "@/dl/products.data"
import { Category } from "@/generated/prisma/enums"
import { getAllProductsForProductsPageType } from "@/types/Product.type"

export default async function ProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; size?: string; category?: Category }>
}) {
	const session = await auth()
	const authId = session?.user?.id
	const pageNumber = (await searchParams).page || 1
	const pageSize = (await searchParams).size || 12
	const activeCategory = (await searchParams).category
	const products: getAllProductsForProductsPageType = await getAllProductsForProductsPage(
		+pageSize,
		+pageNumber,
		activeCategory as Category,
	)

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-12 px-4">
			<h2>المنتجات</h2>

			{/* -------------------------------- filter ------------------------------- */}
			<ProductFilter activeCategory={activeCategory as Category} />

			{/* ------------------------------- products ------------------------------- */}
			<div className="grid container mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center gap-8 ">
				{products?.data.map((product) => (
					<ProductCard product={product} key={product.id} authId={authId!} />
				))}
			</div>
		</div>
	)
}
