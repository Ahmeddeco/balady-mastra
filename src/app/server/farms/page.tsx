import { isAdmin } from "@/logic/isAdmin"
import { MoreVertical, PlusCircle } from "lucide-react"
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
import EmptyCard from "@/components/shared/EmptyCard"
import { Badge } from "@/components/ui/badge"
import { getAllFarmsForServerFarmsPageType } from "@/types/farm.type"
import { getAllFarmsForServerFarmsPage } from "@/dl/farm.data"
import { deleteFarmAction } from "@/actions/farm.action"
import MapDialog from "@/components/shared/MapDialog"

export default async function ProductsServerPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; size: string }>
}) {
	await isAdmin()

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const farms: getAllFarmsForServerFarmsPageType = await getAllFarmsForServerFarmsPage(pageSize, pageNumber)

	return !farms ? (
		<EmptyCard href={"/server/farms/add"} linkTitle={"أضف مزرعة"} linkIcon={PlusCircle} />
	) : (
		<ServerPageCard
			icon={PlusCircle}
			title={"جميع المنتجات"}
			description={"جميع المزارع في قاعدة البيانات."}
			btnTitle={"أضف مزرعة"}
			href={"/server/farms/add"}
		>
			<div className="flex flex-col gap-8">
				<Table>
					{/* ---------------------------- TableHeader ---------------------------- */}
					<TableHeader>
						<TableRow>
							<TableHead>اسم المزرعة</TableHead>
							<TableHead>اسم المدير</TableHead>
							<TableHead>عنوان المزرعة</TableHead>
							<TableHead>العنوان على الخريطة</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{farms?.data.map(({ id, city, country, manager, name, state, lat, lng }) => (
							<TableRow key={id}>
								<TableCell className="capitalize">{name}</TableCell>
								<TableCell className="capitalize">{manager.name}</TableCell>
								<TableCell>
									<Badge variant={"outline"}>
										{country} - {state} - {city}
									</Badge>
								</TableCell>
								<TableCell>
									<MapDialog lat={lat ?? "30"} lng={lng ?? "31"} />
								</TableCell>

								{/* -------------------------------- settings -------------------------------- */}
								<TableCell className="text-left ">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant={"outline"} size={"icon"} suppressHydrationWarning>
												<MoreVertical />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="flex flex-col gap-2 items-center justify-center p-2">
											<DropdownMenuItem asChild>
												<Button asChild size={"lg"} className="w-full" variant={"outline"}>
													<Link href={`/server/farms/edit/${id}`}>تعديل</Link>
												</Button>
											</DropdownMenuItem>
											{/* ---------------------------- delete --------------------------- */}
											<DropdownMenuItem asChild>
												<Dialog>
													<DialogTrigger asChild>
														<Button size={"lg"} className="w-full">
															حذف
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>هل أنت متأكد من رغبتك في حذف هذه المزرعة؟</DialogTitle>
															<DialogDescription>
																لا يمكن التراجع عن هذا الإجراء. سيؤدي ذلك إلى حذف هذا المنتج نهائيًا وإزالة بياناتها من
																خوادمنا.
															</DialogDescription>
														</DialogHeader>
														<div className="flex items-center justify-between ">
															<Button asChild variant={"secondary"}>
																<DialogClose>إلغاء الحذف</DialogClose>
															</Button>
															<Form action={deleteFarmAction}>
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
								{Array.from({ length: farms!.totalPages ?? 1 }).map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									{/* ----------------------------- Next ----------------------------- */}
									{pageNumber < farms!.totalPages && (
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
