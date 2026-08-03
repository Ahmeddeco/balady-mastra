import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { TableCaption } from "@/components/ui/table"

type Props = {
	pageNumber: number
	pageSize: number
	totalPages: number
}

export default function PaginationSection({ pageNumber, pageSize, totalPages }: Props) {
	return (
		<TableCaption>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						{/* --------------------------- Previous --------------------------- */}
						{pageNumber > 1 && <PaginationPrevious href={`?size=${pageSize}&page=${pageNumber - 1}`} />}
					</PaginationItem>
					{/* ------------------------- PaginationLink ------------------------ */}
					{Array.from({ length: totalPages ?? 1 }).map((_, index) => (
						<PaginationItem key={index}>
							<PaginationLink href={`?size=${pageSize}&page=${index + 1}`} isActive={pageNumber === index + 1}>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						{/* ----------------------------- Next ----------------------------- */}
						{pageNumber < totalPages && <PaginationNext href={`?size=${pageSize}&page=${pageNumber + 1}`} />}
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</TableCaption>
	)
}
