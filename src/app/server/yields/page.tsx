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
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import React from "react"
import { Role } from "@/generated/prisma/enums"
import { getAllYieldsForServerFarmsPageType } from "@/types/yield.type"
import { getAllYieldsForServerFarmsPage } from "@/dl/yield.data"
import { formateDate } from "@/logic/formateDate"
import { deleteYieldAction } from "@/actions/yield.action"

export default async function YieldsPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; size: string; role: Role }>
}) {
	await isAdmin()

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const allYields: getAllYieldsForServerFarmsPageType = await getAllYieldsForServerFarmsPage(pageSize, pageNumber)

	return (
		<ServerPageCard
			icon={PlusCircle}
			title={"جميع التصافي"}
			description={"جميع التصافي في قاعدة البيانات."}
			btnTitle={"أضف تصافي"}
			href={"/server/yields/add"}
		>
			<div className="flex flex-col gap-8">
				<Table>
					{/* ---------------------------- TableHeader ---------------------------- */}
					<TableHeader>
						<TableRow>
							<TableHead>صورة الحيوان</TableHead>
							<TableHead>السلالة</TableHead>
							<TableHead>تاريخ التقرير</TableHead>
							<TableHead>وزن التصافي</TableHead>
							<TableHead>وزن العظم</TableHead>
							<TableHead>وزن الدهن</TableHead>
							<TableHead>وزن الهالك</TableHead>
							<TableHead>وزن اللحم الصافي</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{allYields?.data.map(
							({ boneWeight, cattle, fatWeight, hotCarcassWeight, id, netYieldWeight, wasteWeight, createdAt }) => (
								<TableRow key={id}>
									<TableCell>
										{cattle.image ? (
											<Image
												src={cattle.image}
												alt={"الحيوان"}
												width={50}
												height={50}
												className="rounded-lg object-cover"
											/>
										) : (
											React.createElement(ImageOff)
										)}
									</TableCell>
									<TableCell>
										<Badge>{cattle.breed.name}</Badge>
									</TableCell>
									<TableCell>{formateDate(createdAt)}</TableCell>
									<TableCell>{hotCarcassWeight} </TableCell>
									<TableCell>{boneWeight} </TableCell>
									<TableCell>{fatWeight}</TableCell>
									<TableCell>{wasteWeight}</TableCell>
									<TableCell>{netYieldWeight}</TableCell>

									{/* -------------------------------- settings -------------------------------- */}
									<TableCell className="text-left col-span-1">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant={"outline"} size={"icon"}>
													<MoreVertical />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start" className="space-y-2 p-2">
												<DropdownMenuItem asChild>
													<Button variant={"secondary"} size={"full"} asChild>
														<Link href={`/server/yields/edit/${id}`}>تعديل</Link>
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
																<DialogTitle>هل أنت متأكد من رغبتك في حذف هذا التقرير؟</DialogTitle>
																<DialogDescription>
																	لا يمكن التراجع عن هذا الإجراء. سيؤدي ذلك إلى حذف هذا التقرير نهائيًا وإزالة بياناته
																	من خوادمنا.
																</DialogDescription>
															</DialogHeader>
															<div className="flex items-center justify-between ">
																<Button asChild variant={"outline"}>
																	<DialogClose>إلغاء الحذف</DialogClose>
																</Button>
																<Form action={deleteYieldAction}>
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
								{Array.from({ length: allYields!.totalPages ?? 1 }).map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									{/* ----------------------------- Next ----------------------------- */}
									{pageNumber < allYields!.totalPages && (
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
