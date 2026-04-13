import { Button } from "../ui/button"
import { LogIn } from "lucide-react"
import { signIn } from "../../../auth"
import Form from "next/form"

export default function Login() {
	const signinWithGoogle = async () => {
		"use server"
		await signIn("google", { redirectTo: "/" })
	}
	return (
		<Form action={signinWithGoogle}>
			<Button type="submit" size={"sm"}>
				<LogIn />
				SignIn
			</Button>
		</Form>
	)
}
