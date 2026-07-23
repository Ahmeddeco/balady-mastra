import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "../ui/button"
import { PlusCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import React from "react"

type Props = {
	href: string
	linkTitle: string
}

export default function EmptyCard({ href, linkTitle }: Props) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Trash2 />
				</EmptyMedia>
				<EmptyTitle>No data</EmptyTitle>
				<EmptyDescription>No data found in the database.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button asChild>
					<Link href={href}>
						{React.createElement(PlusCircle)}
						{linkTitle}
					</Link>
				</Button>
			</EmptyContent>
		</Empty>
	)
}
