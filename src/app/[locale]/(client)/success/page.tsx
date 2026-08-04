import { verifyAndProcessPayment } from "@/actions/verify-payment.action"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

interface SuccessPageProps {
	searchParams: Promise<Record<string, string>>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
	const params = await searchParams

	const result = await verifyAndProcessPayment({ searchParams: params })

	if (!result.success) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
				<h1 className="text-2xl font-bold text-red-600">فشلت عملية التحقق</h1>
				<p className="text-slate-600">{result.error}</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
			<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
				✓
			</div>
			<h1 className=" text-green-600">تمت العملية بنجاح!</h1>
			<div className="flex items-center justify-center gap-2">
				<Badge variant={"outline"}>
					<strong>رقم الطلب:</strong> {result.orderId}
				</Badge>
				<Badge variant={"outline"}>
					<strong>رقم المعاملة (Transaction ID):</strong> {result.transactionId}
				</Badge>
			</div>
			<h4>{result.message}</h4>
			<Button asChild variant={"outline"}>
				<Link href={"/"}>
					<Home /> go home
				</Link>
			</Button>
		</div>
	)
}
