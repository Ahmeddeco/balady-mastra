"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"
import { Loader2, LucideIcon, X } from "lucide-react"
import { IoBagCheckOutline } from "react-icons/io5"
import React from "react"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa6"
import { useCurrentLocale } from "@/locales/client.locale"

type SubmitButtonType = {
	title: string
	type?: "button" | "submit" | "reset" | undefined
	size?: "default" | "sm" | "lg" | "full" | "icon" | null | undefined
	variant?: "link" | "default" | "secondary" | "destructive" | "outline" | "ghost" | undefined
	icon: LucideIcon
}

/* ------------------------------ SubmitButton ------------------------------ */

export function SubmitButton({ title, type = "submit", size = "full", variant, icon }: SubmitButtonType) {
	const { pending } = useFormStatus()

	return (
		<>
			{pending ? (
				<Button disabled variant={variant} size={size}>
					<Loader2 className="size-4 animate-spin" />
					please wait
				</Button>
			) : (
				<Button type={type} size={size} variant={variant}>
					{icon && React.createElement(icon)}
					{title}
				</Button>
			)}
		</>
	)
}

/* ----------------------------- CheckOutButton ----------------------------- */

export const CheckOutButton = () => {
	const { pending } = useFormStatus()
	return (
		<>
			{pending ? (
				<Button disabled>
					<Loader2 className="size-5 animate-spin" /> please wait
				</Button>
			) : (
				<Button type="button" onClick={() => console.log("CheckOut Button pressed!")}>
					<IoBagCheckOutline /> إتمام عملية الشراء
				</Button>
			)}
		</>
	)
}

/* ---------------------------- deleteItemButton ---------------------------- */

export function DeleteItemButton() {
	const { pending } = useFormStatus()
	return (
		<>
			{pending ? (
				<Button disabled size={"sm"} variant={"destructive"}>
					<Loader2 className="size-5 animate-spin" /> removing ...
				</Button>
			) : (
				<Button type="submit" size={"icon"} variant={"destructive"}>
					<X /> delete
				</Button>
			)}
		</>
	)
}

/* ---------------------------- WhatsAppContactUs --------------------------- */
export const WhatsAppContactUs = ({ mobile }: { mobile: string }) => {
	const locale = useCurrentLocale()
	return (
		<Button asChild size={"sm"} variant={"outline"}>
			<Link href={`https://wa.me/${mobile}`} target="_blank">
				<FaWhatsapp />
				{locale === "en" ? "contact us" : "تواصل معنا"}
			</Link>
		</Button>
	)
}
