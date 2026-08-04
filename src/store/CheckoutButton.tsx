"use client"

import { createOrder } from "@/actions/order.action"
import { createPaymobCheckout } from "@/actions/paymob.action"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { CartItem, useCartStore } from "@/store/cartStore"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"

type Props = {
	shippingAddress?: string
	deliveryFee?: number
	customerNotes?: string
}

export default function CheckoutButton({
	shippingAddress = "شبين الكوم - المنوفية",
	customerNotes,
	deliveryFee = Number(process.env.NEXT_PUBLIC_DELIVERY_FEE) ?? 0,
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
					quantity: item.quantity,
					stock: item.stock,
					unit: item.unit,
				})),
			})

			if (!orderResult.success || !orderResult.order) {
				alert(orderResult.error || "فشل إنشاء الطلب")
				return
			}

			/* ---------------- الخطوة الثانية: إرسال الطلب إلى Paymob --------------- */
			const formattedItems = items.map((item) => ({
				name: item.titleAr,
				amount: Math.round(Number(item.price) * 100 * (item.quantity ?? 1)),
			}))

			const deliveryFeeCents = Math.round(Number(deliveryFee) * 100)

			const paymobItems = [
				...formattedItems,
				...(deliveryFeeCents > 0 ? [{ name: "التوصيل", amount: deliveryFeeCents }] : []),
			]

			await createPaymobCheckout({
				amount: paymobItems.reduce((sum, item) => sum + item.amount, 0),
				orderId: orderResult.order.id,
				items: paymobItems,
				user,
			})
		})
	}

	return (
		<Button type="button" onClick={handlePayment} disabled={isPending || items.length === 0}>
			{isPending ? (
				<>
					<Loader2 className="animate-spin" />
					<span>جاري تحويل الصفحة الى Paymob</span>
				</>
			) : (
				"ادفع الآن عبر Paymob "
			)}
		</Button>
	)
}
