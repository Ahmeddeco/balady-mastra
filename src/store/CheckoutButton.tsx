"use client"

import { createOrder } from "@/actions/order.action"
import { createPaymobCheckout } from "@/actions/paymob.action"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { CartItem, useCartStore } from "@/store/cartStore"
import { useTransition } from "react"

type Props = {
	shippingAddress?: string
	deliveryFee?: number
	customerNotes?: string
}

export default function CheckoutButton({
	shippingAddress = "شبين الكوم - المنوفية",
	customerNotes,
	deliveryFee = 0,
}: Props) {
	const [isPending, startTransition] = useTransition()
	const items: CartItem[] = useCartStore((state) => state.items)
	const session = authClient.useSession()
	const user = session.data?.user

	const handlePayment = () => {
		if (items.length === 0) return

		startTransition(async () => {
			// إنشاء الطلب في قاعدة البيانات
			const orderResult = await createOrder({
				shippingAddress,
				customerNotes,
				deliveryFee,
				userId: user?.id,
				items: items.map((item) => ({
					id: item.id,
					titleAr: item.titleAr,
					titleEn: item.titleEn,
					mainImage: item.mainImage,
					price: item.price,
					quantity: item.quantity ?? item.requestedQuantity ?? 1,
					requestedQuantity: item.requestedQuantity ?? item.quantity ?? 1,
					preparation: item.preparation,
				})),
			})

			if (!orderResult.success || !orderResult.order) {
				alert(orderResult.error || "فشل إنشاء الطلب")
				return
			}

			const formattedItems = items.map((item) => ({
				name: item.titleAr,
				amount: item.price * 100,
			}))
			// الخطوة الثانية: إرسال الطلب إلى Paymob
			await createPaymobCheckout({
				amount: Math.round(orderResult.order.total * 100),
				orderId: orderResult.order.id,
				items: formattedItems,
				user,
			})
		})
	}

	return (
		<Button type="button" onClick={handlePayment} disabled={isPending || items.length === 0}>
			{isPending ? "جاري تحويل الصفحة الى Paymob" : "ادفع الآن عبر Paymob "}
		</Button>
	)
}
