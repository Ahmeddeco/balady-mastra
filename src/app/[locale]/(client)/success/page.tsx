import { verifyAndProcessPayment } from "@/actions/verify-payment.action"

interface SuccessPageProps {
	searchParams: Promise<Record<string, string>>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
	const params = await searchParams

	// تنفيذ الـ Server Action وتحديث قاعدة البيانات مباشرة
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
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
			<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
				✓
			</div>
			<h1 className="text-2xl font-bold text-green-600">تمت العملية بنجاح!</h1>
			<div className="bg-slate-50 p-4 rounded-lg border text-sm space-y-1">
				<p>
					<strong>رقم الطلب:</strong> {result.orderId}
				</p>
				<p>
					<strong>رقم المعاملة (Transaction ID):</strong> {result.transactionId}
				</p>
			</div>
		</div>
	)
}
