"use client"

import { authClient } from "@/lib/auth-client"
import { productCart, useCartStore } from "./cartStore"
import { useFormStatus } from "react-dom"
import { useCurrentLocale } from "@/locales/client.locale"
import { Button } from "@/components/ui/button"
import { Loader2, Minus, Plus, ShoppingBag, XCircle } from "lucide-react"

type Props = { product: productCart; className?: string }

export default function AddToCart({ product, className }: Props) {
	const { data, isPending } = authClient.useSession()
	const { pending } = useFormStatus()
	const { items, updateQuantity, addToCart, removeFromCart } = useCartStore((state) => state)
	const locale = useCurrentLocale()
	const currentItem = items.find((item) => item.id === product.id)

	if (!data?.session || isPending) return null

	return (
		<div className="w-full">
			{pending ? (
				<Button size={"full"} disabled className={className} variant={"default"}>
					<Loader2 className="size-5 animate-spin" /> انتظر لحظة
				</Button>
			) : currentItem ? (
				<div className="flex items-center justify-between w-full ">
					<div className=" flex items-center gap-4 w-full">
						<Button
							variant={"ghost"}
							size={"icon"}
							type="button"
							onClick={() => {
								updateQuantity("decrement", product.id!)
							}}
						>
							<Minus />
						</Button>
						<Button size={"icon"} type="button" variant={"outline"} className="cursor-none">
							{currentItem?.quantity.toFixed(0) ?? 0}
						</Button>
						<Button
							variant={"ghost"}
							size={"icon"}
							type="button"
							onClick={() => {
								updateQuantity("increment", product.id!)
							}}
						>
							<Plus />
						</Button>
					</div>
					<Button type="button" variant={"destructive"} onClick={() => removeFromCart(product.id)}>
						<XCircle /> {locale === "en" ? "remove from cart" : "إحذف المنتج من السلة"}
					</Button>
				</div>
			) : (
				<Button size={"full"} variant={"default"} type="button" onClick={() => addToCart(product)}>
					<ShoppingBag /> {locale === "en" ? "add to cart" : "أضف الى السلة"}
				</Button>
			)}
		</div>
	)
}
