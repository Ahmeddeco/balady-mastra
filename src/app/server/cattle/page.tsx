import { isAdmin } from "@/logic/isAdmin"
import { ImageOff, Link2, MoreVertical, PlusCircle } from "lucide-react"
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
import Image from "next/image"
import { deleteBreedAction } from "@/actions/breed.action"
import { getAllCattleForServerCattlePage } from "@/dl/cattle.data"
import { getAllCattleForServerCattlePageType } from "@/types/cattle.type"
import { formateDate } from "@/logic/formateDate"

export default async function CattleServerPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; size: string }>
}) {
	await isAdmin()

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const cattle: getAllCattleForServerCattlePageType = await getAllCattleForServerCattlePage(pageSize, pageNumber)

	return !cattle ? (
		<EmptyCard href={"/server/cattle/add"} linkTitle={"أضف حيوان"} linkIcon={PlusCircle} />
	) : (
		<ServerPageCard
			icon={PlusCircle}
			title={"جميع الحيوانات"}
			description={"جميع الحيوانات في قاعدة البيانات."}
			btnTitle={"أضف حيوان"}
			href={"/server/cattle/add"}
		>
			<div className="flex flex-col gap-8">
				<Table>
					{/* ---------------------------- TableHeader ---------------------------- */}
					<TableHeader>
						<TableRow>
							<TableHead>صورة الحيوان</TableHead>
							<TableHead>تاريخ الذبح</TableHead>
							<TableHead>السلالة</TableHead>
							<TableHead>النوع</TableHead>
							<TableHead>العمر</TableHead>
							<TableHead>الوزن القائم</TableHead>
							<TableHead>المزرعة</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{cattle?.data.map(({ age, breed, createdAt, farm, gender, id, image, liveWeight }) => (
							<TableRow key={id}>
								<TableCell>
									{image ? (
										<Image
											src={image}
											alt={breed.name ?? "cattle"}
											width={48}
											height={48}
											className="rounded-md object-cover aspect-square"
										/>
									) : (
										<ImageOff />
									)}
								</TableCell>
								<TableCell>{formateDate(createdAt)}</TableCell>
								<TableCell>{breed.name}</TableCell>
								<TableCell>{gender}</TableCell>
								<TableCell>{age}</TableCell>
								<TableCell>{liveWeight}</TableCell>
								<TableCell>
									<Button asChild size={"sm"} variant={"outline"}>
										<Link href={`/farms/${farm.id}`}>
											<Link2 />
											{farm.name}
										</Link>
									</Button>
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
													<Link href={`/server/cattle/edit/${id}`}>تعديل</Link>
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
															<Form action={deleteBreedAction}>
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
								{Array.from({ length: cattle!.totalPages ?? 1 }).map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									{/* ----------------------------- Next ----------------------------- */}
									{pageNumber < cattle!.totalPages && (
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
