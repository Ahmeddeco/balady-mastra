"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"
import { Loader2, ShoppingBag, X } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useSession } from "next-auth/react"
import { IoBagCheckOutline } from "react-icons/io5"
import { Product } from "@/generated/prisma/client"

type SubmitButtonType = {
	title: string
	type?: "button" | "submit" | "reset" | undefined
	size?: "default" | "sm" | "lg" | "full" | "icon" | null | undefined
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

/* ------------------------------ SubmitButton ------------------------------ */

export function SubmitButton({ title, type = "submit", size = "full", variant }: SubmitButtonType) {
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
					{title}
				</Button>
			)}
		</>
	)
}

/* -------------------------------- AddToCart ------------------------------- */

export function AddToCart({ product }: { product: Product }) {
	const session = useSession()
	const { pending } = useFormStatus()
	const addToCart = useCartStore((state) => state.addToCart)

	!session ? null : (
		<>
			{pending ? (
				<Button disabled>
					<Loader2 className="size-5 animate-spin" /> please wait
				</Button>
			) : (
				<Button type="button" onClick={() => addToCart(product)}>
					<ShoppingBag className="size-5" /> Add to Cart
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
					<IoBagCheckOutline /> اتمام عملية الشراء
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
