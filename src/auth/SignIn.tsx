"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { LogIn } from "lucide-react"
import Form from "next/form"

export default function SignIn() {
	const signIn = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "",
		})
	}

	return (
		<Form action={signIn}>
			<Button type="submit" size={"icon"} variant={"outline"}>
				<LogIn />
			</Button>
		</Form>
	)
}
