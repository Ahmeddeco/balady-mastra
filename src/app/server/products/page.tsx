import { isAdmin } from "@/logic/isAdmin"
import { ImageOff, MoreVertical, PlusCircle } from "lucide-react"
import ServerPageCard from "@/components/shared/ServerPageCard"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import Form from "next/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import React from "react"
import { deleteUserAction } from "@/actions/user.action"
import { Category } from "@/generated/prisma/enums"
import { getAllProductsForProductsServerPage } from "@/dl/products.data"
import ProductFilter from "@/components/shared/ProductFilter"
import EmptyCard from "@/components/shared/EmptyCard"
import { Badge } from "@/components/ui/badge"
import { getAllProductsForProductsServerPageType } from "@/types/Product.type"

export default async function ProductsServerPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; size: string; category: Category }>
}) {
	await isAdmin()

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const activeCategory = (await searchParams).category
	const products: getAllProductsForProductsServerPageType = await getAllProductsForProductsServerPage(
		pageSize,
		pageNumber,
		activeCategory,
	)

	return !products ? (
		<EmptyCard href={""} linkTitle={""} linkIcon={PlusCircle} />
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
							<TableHead className="text-right">صورة المنتج</TableHead>
							<TableHead className="text-right">اسم النتج</TableHead>
							<TableHead className="text-right">القطعية</TableHead>
							<TableHead className="text-right">السعر</TableHead>
							<TableHead className="text-right">الخصم</TableHead>
							<TableHead className="text-right">المخزون</TableHead>
							<TableHead className="text-right">الخصائص</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{products?.data.map(({ id, category, discount, mainImage, price, title, cut, unit, stock }) => (
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
								<TableCell className="text-right">{title}</TableCell>
								<TableCell className="text-right">{cut}</TableCell>
								<TableCell className="text-right">{price}</TableCell>
								<TableCell className="text-right">{discount} %</TableCell>
								<TableCell className="text-right">{stock}</TableCell>
								<TableCell className="flex items-center gap-2 ">
									<Badge variant={"default"}>{category} </Badge>
									<Badge variant={"default"}>{unit} </Badge>
								</TableCell>

								{/* -------------------------------- settings -------------------------------- */}
								<TableCell className="text-left ">
									<DropdownMenu>
										<DropdownMenuTrigger render={<Button variant={"outline"} size={"icon"} suppressHydrationWarning />}>
											<MoreVertical />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="flex flex-col gap-2 items-center justify-center p-2">
											<DropdownMenuItem
												render={
													<Button
														size={"lg"}
														render={<Link href={`/server/products/edit/${id}`} />}
														className="w-full"
														variant={"outline"}
													>
														تعديل
													</Button>
												}
											/>
											{/* ---------------------------- delete --------------------------- */}
											<DropdownMenuItem
												render={
													<Dialog>
														<DialogTrigger
															render={
																<Button size={"lg"} className="w-full">
																	حذف
																</Button>
															}
														></DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>هل أنت متأكد من رغبتك في حذف هذا المنتج؟</DialogTitle>
																<DialogDescription>
																	لا يمكن التراجع عن هذا الإجراء. سيؤدي ذلك إلى حذف هذا المنتج نهائيًا وإزالة بياناته من
																	خوادمنا.
																</DialogDescription>
															</DialogHeader>
															<div className="flex items-center justify-between ">
																<Button render={<DialogClose>إلغاء الحذف</DialogClose>} variant={"secondary"}></Button>
																<Form action={deleteUserAction}>
																	<Input type="hidden" name="id" value={id} />
																	<Button type="submit">الحذف نهائيا</Button>
																</Form>
															</div>
														</DialogContent>
													</Dialog>
												}
											></DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					{/* ---------------------------- Pagination ---------------------------- */}
					<TableCaption>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									{/* --------------------------- Previous --------------------------- */}
									{pageNumber > 1 && <PaginationPrevious href={`?size=${pageSize}&page=${pageNumber - 1}`} />}
								</PaginationItem>
								{/* ------------------------- PaginationLink ------------------------ */}
								{Array.from({ length: products!.totalPages ?? 1 }).map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									{/* ----------------------------- Next ----------------------------- */}
									{pageNumber < products!.totalPages && (
										<PaginationNext href={`?size=${pageSize}&page=${pageNumber + 1}`} />
									)}
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</TableCaption>
				</Table>
			</div>
		</ServerPageCard>
	)
}
