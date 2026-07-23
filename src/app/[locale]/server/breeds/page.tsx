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
import EmptyCard from "@/components/shared/EmptyCard"
import { Badge } from "@/components/ui/badge"
import { getAllBreedsForServerFarmsPageType } from "@/types/breed.type"
import { getAllBreedsForServerFarmsPage } from "@/dl/breed.data"
import Image from "next/image"
import { deleteBreedAction } from "@/actions/breed.action"

export default async function BreedsServerPage({
	searchParams,
}: {
	searchParams: Promise<{ page: string; size: string }>
}) {
	await isAdmin()

	const { page, size } = await searchParams
	const pageNumber = +page > 1 ? +page : 1
	const pageSize = +size || 10
	const breeds: getAllBreedsForServerFarmsPageType = await getAllBreedsForServerFarmsPage(pageSize, pageNumber)

	return !breeds ? (
		<EmptyCard href={"/server/breeds/add"} linkTitle={"أضف سلالة"} linkIcon={PlusCircle} />
	) : (
		<ServerPageCard
			icon={PlusCircle}
			title={"جميع السلالات"}
			description={"جميع السلالات في قاعدة البيانات."}
			btnTitle={"أضف سلالة"}
			href={"/server/breeds/add"}
		>
			<div className="flex flex-col gap-8">
				<Table>
					{/* ---------------------------- TableHeader ---------------------------- */}
					<TableHeader>
						<TableRow>
							<TableHead>صورة السلالة</TableHead>
							<TableHead>اسم السلالة</TableHead>
							<TableHead>النوع</TableHead>
							<TableHead>معدل التحويل الغذائي</TableHead>
							<TableHead className="text-left">الإعدادات</TableHead>
						</TableRow>
					</TableHeader>
					{/* ----------------------------- TableBody ----------------------------- */}
					<TableBody>
						{breeds?.data.map(({ id, conversionRate, image, name, type }) => (
							<TableRow key={id}>
								<TableCell className="capitalize">
									{image ? (
										<Image
											src={image}
											alt={name ?? "breed"}
											width={48}
											height={48}
											className="rounded-lg object-cover"
										/>
									) : (
										<ImageOff />
									)}
								</TableCell>
								<TableCell className="capitalize">{name}</TableCell>
								<TableCell>
									<Badge>{type}</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={"outline"}>{conversionRate?.toString() ?? "0.0"}</Badge>
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
													<Link href={`/server/breeds/edit/${id}`}>تعديل</Link>
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
								{Array.from({ length: breeds!.totalPages ?? 1 }).map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									{/* ----------------------------- Next ----------------------------- */}
									{pageNumber < breeds!.totalPages && (
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
