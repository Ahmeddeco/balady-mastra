"use client"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import Form from "next/form"
import { useActionState } from "react"

export type DeleteActionState = {
	success?: boolean
	error?: string | null
}

type Props = {
	id: string
	deleteAction: (prevState: DeleteActionState, formData: FormData) => Promise<DeleteActionState>
}

export function Delete({ deleteAction, id }: Props) {
	const [state, action, isPending] = useActionState(deleteAction, {
		success: false,
		error: null,
	})

	return (
		<Form action={action}>
			<Input type="hidden" name="id" value={id} />
			{isPending ? (
				<Button variant="destructive" type="submit" disabled={isPending}>
					<Spinner /> Deleting...
				</Button>
			) : (
				<Button variant="destructive" type="submit" disabled={isPending}>
					Delete
				</Button>
			)}
			{state.error && <FieldError>{state.error}</FieldError>}
		</Form>
	)
}
