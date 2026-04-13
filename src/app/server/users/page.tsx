import { getAllUsersForUsersPage } from "@/dl/user.data"
import { getAllUsersForUsersPageType } from "@/types/user.type"
import { isAdmin } from "@/logic/isAdmin"
import { ImageOff, MoreVertical, PlusCircle, UserSquare2 } from "lucide-react"
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
import { deleteUserAction } from "@/actions/user.action"
import { Role } from "@/generated/prisma/enums"
import UserFilter from "@/components/shared/UserFilter"

export default async function UsersPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; size: string; role: Role }>
}) {
	await isAdmin()

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const activeRole = (await searchParams).role
	const users: getAllUsersForUsersPageType = await getAllUsersForUsersPage(pageSize, pageNumber, activeRole)

	return (
		<ServerPageCard
			icon={PlusCircle}
			title={"جميع المستخدمين"}
			description={"جميع المستخدمين في قاعدة البيانات."}
			btnTitle={"أضف مستخدم"}
			href={"/server/users/add"}
		>
			<div className="flex flex-col gap-8">
				{/* ---------------------------- SORT BY ROLE ---------------------------- */}
				<UserFilter activeRole={activeRole} />

				<Table>
					{/* ---------------------------- TableHeader ---------------------------- */}
					<TableHeader>
						<TableRow>
							<TableHead>الصورة</TableHead>
							<TableHead>الاسم</TableHead>
							<TableHead>الايميل</TableHead>
							<TableHead>الهاتف الرئيسي</TableHead>
							<TableHead>العنوان</TableHead>
							<TableHead>الدور الوظيفي</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{users?.data.map(({ city, country, email, id, image, name, role, primaryMobile, state }) => (
							<TableRow key={id}>
								<TableCell>
									{image ? (
										<Image src={image} alt={"user"} width={50} height={50} className="rounded-lg object-cover" />
									) : (
										React.createElement(ImageOff)
									)}
								</TableCell>
								<TableCell>{name}</TableCell>
								<TableCell className="lowercase">{email} </TableCell>
								<TableCell>{primaryMobile} </TableCell>
								<TableCell>
									{city} - {state} - {country}
								</TableCell>
								<TableCell>
									<Badge
										variant={(() => {
											switch (role) {
												case Role.CLIENT:
													return "accent"
												case Role.ADMIN:
													return "default"
												case Role.SUPPLIER:
													return "secondary"
												default:
													return "amber"
											}
										})()}
									>
										{role}
									</Badge>
								</TableCell>

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
												<Button variant={"accent"} size={"full"} asChild>
													<Link href={`/server/users/edit/${id}`}>تعديل</Link>
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
								{Array.from({ length: users!.totalPages ?? 1 }).map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									{/* ----------------------------- Next ----------------------------- */}
									{pageNumber < users!.totalPages && (
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
