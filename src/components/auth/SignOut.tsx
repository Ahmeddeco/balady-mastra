import { Button } from "../ui/button"
import Form from "next/form"
import { LogOut } from "lucide-react"
import { signOut } from "../../../auth"

export default function SignOut() {
	const logOut = async () => {
		"use server"
		await signOut({ redirectTo: "/" })
	}

	return (
		<Form action={logOut} className="w-full">
			<Button type="submit" className="w-full ">
				<LogOut className="text-foreground" />
				SignOut
			</Button>
		</Form>
	)
}
