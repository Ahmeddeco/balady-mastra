"use client"

import { createOrder } from "@/actions/order.action"
import { createPaymobCheckout } from "@/actions/paymob.action"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { useTransition } from "react"

type Props = {
	shippingAddress?: string
}

export default function CheckoutButton({ shippingAddress = "شبين الكوم - المنوفية" }: Props) {
	const [isPending, startTransition] = useTransition()
	const items = useCartStore((state) => state.items)

	const handlePayment = () => {
		if (items.length === 0) return

		startTransition(async () => {
			// الخطوة الأولى: إنشاء الطلب في قاعدة البيانات
			const orderResult = await createOrder({
				shippingAddress,
				items: items.map((item) => ({
					id: item.id,
					price: item.price,
					quantity: item.quantity,
				})),
			})

			if (!orderResult.success || !orderResult.order) {
				alert(orderResult.error || "فشل إنشاء الطلب")
				return
			}

			// الخطوة الثانية: إرسال الطلب إلى Paymob
			await createPaymobCheckout({
				amount: Math.round(orderResult.order.total * 100),
				orderId: orderResult.order.id,
			})
		})
	}

	return (
		<Button type="button" onClick={handlePayment} disabled={isPending || items.length === 0}>
			{isPending ? "جاري تحويل الصفحة الى Paymob" : "ادفع الآن عبر Paymob "}
		</Button>
	)
}
