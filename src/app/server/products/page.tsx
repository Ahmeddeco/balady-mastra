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
	const products = await getAllProductsForProductsServerPage(pageSize, pageNumber, activeCategory)

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
							<TableHead>صورة المنتج</TableHead>
							<TableHead>اسم النتج</TableHead>
							<TableHead>السعر</TableHead>
							<TableHead>الخصم</TableHead>
							<TableHead>المخزون</TableHead>
							<TableHead>معروض للبيع</TableHead>
							<TableHead>الخصائص</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{products?.data.map(
							({ id, category, discount, mainImage, price, slug, title, unit, isActive, quantity }) => (
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
									<TableCell>{title}</TableCell>
									<TableCell>{price}</TableCell>
									<TableCell>{discount}</TableCell>
									<TableCell>{quantity}</TableCell>
									<TableCell>
										{isActive === true ? (
											<Badge variant={"accent"}>{"نعم"}</Badge>
										) : (
											<Badge variant={"default"}>{"لا"}</Badge>
										)}
									</TableCell>
									<TableCell className="flex items-center gap-2">
										<Badge>{category} </Badge>
										<Badge>{unit} </Badge>
									</TableCell>

									{/* -------------------------------- settings -------------------------------- */}
									<TableCell className="text-left col-span-1">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant={"outline"} size={"icon"} suppressHydrationWarning>
													<MoreVertical />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start" className="space-y-2 p-2">
												<DropdownMenuItem asChild>
													<Button variant={"accent"} size={"full"} asChild>
														<Link href={`/server/products/edit/${slug}`}>تعديل</Link>
													</Button>
												</DropdownMenuItem>
												{/* ---------------------------- delete --------------------------- */}
												<DropdownMenuItem asChild>
													<Dialog>
														<DialogTrigger asChild>
															<Button variant={"default"} size={"full"}>
																حذف
															</Button>
														</DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>هل أنت متأكد من رغبتك في حذف هذا المنتج؟</DialogTitle>
																<DialogDescription>
																	لا يمكن التراجع عن هذا الإجراء. سيؤدي ذلك إلى حذف هذا المنتج نهائيًا وإزالة بياناته من
																	خوادمنا.
																</DialogDescription>
															</DialogHeader>
															<div className="flex items-center justify-between ">
																<Button asChild variant={"outline"}>
																	<DialogClose>الغاء الحذف</DialogClose>
																</Button>
																<Form action={deleteUserAction}>
																	<Input type="hidden" name="id" value={id} />
																	<Button type="submit">الحذف نهائيا</Button>
																</Form>
															</div>
														</DialogContent>
													</Dialog>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							),
						)}
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
