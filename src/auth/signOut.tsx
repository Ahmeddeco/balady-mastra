"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import Form from "next/form"
import { useRouter } from "next/navigation"

export default function SignOut() {
	const router = useRouter()

	const signOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/")
					router.refresh()
				},
			},
		})
	}

	return (
		<Form action={signOut} className="w-full">
			<Button type="submit" variant={"destructive"} size={"full"}>
				SignOut
			</Button>
		</Form>
	)
}
