import { Delete, DeleteActionState } from "@/components/backend/Delete"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableCell } from "@/components/ui/table"
import { MoreVertical } from "lucide-react"
import Link from "next/link"
import React from "react"

type Props = {
	id: string
	deleteAction: (prevState: DeleteActionState, formData: FormData) => Promise<DeleteActionState>
	editLink: string
	deleteName: string
}

export default function Settings({ id, deleteAction, editLink, deleteName }: Props) {
	return (
		<TableCell className="text-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="space-y-2">
					<DropdownMenuItem asChild>
						<Button variant={"outline"} size={"full"} asChild>
							<Link href={editLink}>edit</Link>
						</Button>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant={"destructive"} size={"full"}>
									delete
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{`Are you sure you want to delete this ${deleteName} ?`}</DialogTitle>
									<DialogDescription>
										{`This action can not be undone. This will permanently delete this ${deleteName} and remove its data
									from our servers.`}
									</DialogDescription>
								</DialogHeader>
								<div className="flex items-center justify-between mt-4">
									<Button asChild variant={"outline"}>
										<DialogClose>cancel</DialogClose>
									</Button>
									{/* --------------------------------- Delete --------------------------------- */}
									<Delete id={id} deleteAction={deleteAction} />
								</div>
							</DialogContent>
						</Dialog>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</TableCell>
	)
}
