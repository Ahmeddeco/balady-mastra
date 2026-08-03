import { ImageOff, Percent, PlusCircle } from "lucide-react"
import ServerPageCard from "@/components/backend/ServerPageCard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import React from "react"
import { deleteUserAction } from "@/actions/user.action"
import { Category, Role } from "@/generated/prisma/enums"
import { getAllProductsForProductsServerPage } from "@/dl/products.data"
import ProductFilter from "@/components/shared/ProductFilter"
import EmptyCard from "@/components/shared/EmptyCard"
import { Badge } from "@/components/ui/badge"
import { getAllProductsForProductsServerPageType } from "@/types/Product.type"
import { isAllowedRoles } from "@/auth/isAllowedRoles"
import Settings from "@/components/backend/Settings"
import PaginationSection from "@/components/backend/Pagination"

export default async function ProductsServerPage({
	searchParams,
	params,
}: {
	searchParams: Promise<{ page: string; size: string; category: Category }>
	params: Promise<{ locale: "en" | "ar" }>
}) {
	await isAllowedRoles([Role.admin])

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const activeCategory = (await searchParams).category
	const products: getAllProductsForProductsServerPageType = await getAllProductsForProductsServerPage(
		pageSize,
		pageNumber,
		activeCategory,
	)
	const locale = (await params).locale

	return !products ? (
		<EmptyCard href={""} linkTitle={""} />
	) : (
		<ServerPageCard
			icon={PlusCircle}
			title={"جميع المنتجات"}
			description={"جميع المنتجات في قاعدة البيانات."}
			btnTitle={"أضف منتج"}
			href={"/server/products/add"}
		>
			<div className="flex flex-col gap-8">
				{/* ---------------------------- SORT BY ROLE ---------------------------- */}
				<ProductFilter activeCategory={activeCategory} />
				<Table>
					{/* ---------------------------- TableHeader ---------------------------- */}
					<TableHeader>
						<TableRow>
							<TableHead>{locale === "en" ? "product image" : "صورة المنتج"}</TableHead>
							<TableHead>{locale === "en" ? "product name" : "اسم المنتج"}</TableHead>
							<TableHead>{locale === "en" ? "category" : "الفئة"}</TableHead>
							<TableHead>{locale === "en" ? "cut" : "القطعية"}</TableHead>
							<TableHead>{locale === "en" ? "price" : "السعر"}</TableHead>
							<TableHead>{locale === "en" ? "discount" : "الخصم"}</TableHead>
							<TableHead>{locale === "en" ? "stock" : "المخزون"}</TableHead>
							<TableHead className="text-end">{locale === "en" ? "settings" : "الإعدادات"}</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{products?.data.map(({ id, discount, mainImage, price, titleAr, titleEn, cut, unit, stock, category }) => (
							<TableRow key={id}>
								<TableCell>
									{mainImage ? (
										<Image
											src={mainImage}
											alt={"user"}
											width={50}
											height={50}
											className="rounded-lg object-cover aspect-square"
										/>
									) : (
										React.createElement(ImageOff)
									)}
								</TableCell>
								<TableCell>{locale === "en" ? titleEn : titleAr}</TableCell>
								<TableCell>
									<Badge variant={"outline"}>{category}</Badge>
								</TableCell>
								<TableCell>{cut}</TableCell>
								<TableCell>{+price}</TableCell>
								<TableCell>
									<Badge variant={"ghost"}>
										{discount}
										<Percent />
									</Badge>
								</TableCell>
								<TableCell>
									{+stock} {unit}
								</TableCell>

								{/* -------------------------------- settings -------------------------------- */}
								<Settings
									id={id}
									deleteAction={deleteUserAction}
									editLink={`/server/products/edit/${id}`}
									deleteName={"service"}
								/>
							</TableRow>
						))}
					</TableBody>

					{/* ---------------------------- Pagination ---------------------------- */}
					<PaginationSection pageNumber={pageNumber} pageSize={pageSize} totalPages={products.totalPages} />
				</Table>
			</div>
		</ServerPageCard>
	)
}
