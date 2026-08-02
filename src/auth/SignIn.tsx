"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { LogIn } from "lucide-react"
import Form from "next/form"
import React from "react"

type Props = {
	variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
	size?: "default" | "xs" | "sm" | "lg" | "full" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
	withTitle?: boolean
	icon?: React.ElementType
}

export default function SignIn({ size = "icon-lg", variant = "ghost", withTitle = false, icon = LogIn }: Props) {
	const signIn = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "",
		})
	}

	return (
		<Form action={signIn}>
			<Button type="submit" size={size} variant={variant}>
				{React.createElement(icon)}
				{withTitle && "LogIn with google"}
			</Button>
		</Form>
	)
}
