"use client"

import { authClient } from "@/lib/auth-client"
import { CartItem, useCartStore } from "./cartStore"
import { useFormStatus } from "react-dom"
import { useCurrentLocale } from "@/locales/client.locale"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag, XCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { VariantProps } from "class-variance-authority"

type Props = {
	product: CartItem
	className?: string
	size?: VariantProps<typeof Button>["size"]
	variant?: VariantProps<typeof Button>["variant"]
}

export default function AddToCart({ product, className, size = "full", variant = "default" }: Props) {
	const { data, isPending } = authClient.useSession()
	const { pending } = useFormStatus()
	const { items, updateQuantity, addToCart, removeFromCart } = useCartStore((state) => state)
	const locale = useCurrentLocale()
	const currentItem = items.find((item) => item.id === product.id)

	if (!data?.session || isPending) return null

	return (
		<div className="w-full">
			{pending ? (
				<Button size={size} disabled className={className} variant={variant}>
					<Spinner /> انتظر لحظة
				</Button>
			) : currentItem ? (
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-4 w-full">
						<Button
							variant={"ghost"}
							size={"icon"}
							type="button"
							onClick={() => {
								updateQuantity("decrement", product.id)
							}}
						>
							<Minus />
						</Button>
						<Button size={"icon"} type="button" variant={"outline"} className="cursor-none px-3 min-w-14">
							{/* التعديل ليدعم أوزان اللحوم بالكسور (مثال: 0.50 كجم) */}
							{(currentItem?.requestedQuantity ?? 0).toFixed(2)} كجم
						</Button>
						<Button
							variant={"ghost"}
							size={"icon"}
							type="button"
							onClick={() => {
								updateQuantity("increment", product.id)
							}}
						>
							<Plus />
						</Button>
					</div>
					<Button type="button" variant={"destructive"} onClick={() => removeFromCart(product.id)}>
						<XCircle /> {locale === "en" ? "Remove" : "إحذف من السلة"}
					</Button>
				</div>
			) : (
				<Button size={size} variant={variant} type="button" onClick={() => addToCart(product)}>
					<ShoppingBag /> {locale === "en" ? "Add to cart" : "أضف إلى السلة"}
				</Button>
			)}
		</div>
	)
}
