"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"
import { CircleDollarSign, Loader2, ShoppingCart, X } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useSession } from "next-auth/react"
import { getOneProductBySlugType, SingleProductPageType } from "@/types/Product.type"

type SubmitButtonType = {
	title: string
	type?: "button" | "submit" | "reset" | undefined
	size?: "default" | "sm" | "lg" | "icon" | null | undefined
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

/* ------------------------------ SubmitButton ------------------------------ */

export function SubmitButton({ title, type = "submit", size = "lg", variant }: SubmitButtonType) {
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

export function AddToCart({ product }: { product: SingleProductPageType }) {
	const session = useSession()
	const { pending } = useFormStatus()
	const addToCart = useCartStore((state) => state.addToCart)

	if (!session) return null
	return (
		<>
			{pending ? (
				<Button disabled>
					<Loader2 className="size-5 animate-spin" /> please wait
				</Button>
			) : (
				<Button type="button" onClick={() => addToCart(product)}>
					<ShoppingCart className="size-5" /> أضف الى السلة الآن
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
					<CircleDollarSign /> اتمام عملية الشراء
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
