"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Coordinates = {
	lat: number
	lng: number
}

type AddressDetails = {
	country: string
	state: string
	city: string
}
type GpsProps = {
	cord?: Coordinates | null // أو Coordinates فقط إذا كان إجبارياً
}

//  دالة جلب بيانات العنوان من الإحداثيات (Reverse Geocoding) مدمجة داخلياً
async function fetchAddressFromCoords(lat: number, lng: number): Promise<AddressDetails | null> {
	try {
		// نطلب البيانات بصيغة jsonv2 ومع تحديد اللغة العربية ar
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`,
			{
				headers: {
					"User-Agent": "AhmedApp/1.0", // تعريف التطبيق لتجنب الحظر من الخادم
				},
			},
		)

		if (!response.ok) throw new Error("فشل الاتصال بخادم الخرائط")

		const data = await response.json()
		const address = data.address

		if (!address) return null

		return {
			country: address.country ?? "",
			state: address.state ?? "",
			city: address.city ?? "",
		}
	} catch (error) {
		console.error("Reverse Geocoding Error:", error)
		return null
	}
}

export default function Gps({ cord }: GpsProps) {
	const [coords, setCoords] = useState<Coordinates | null>(cord ?? null)
	const [address, setAddress] = useState<AddressDetails | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const getMyLocation = useCallback(() => {
		if (!("geolocation" in navigator)) {
			toast.error("متصفحك لا يدعم خاصية تحديد الموقع")
			return
		}

		setIsLoading(true)

		const options: PositionOptions = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 0,
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const newCoords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
				setCoords(newCoords)

				try {
					// استدعاء الدالة المدمجة في الأعلى مباشرة
					const addressData = await fetchAddressFromCoords(newCoords.lat, newCoords.lng)

					if (addressData) {
						setAddress(addressData)
						toast.success("تم تحديد الموقع واستخراج العنوان بنجاح")
					} else {
						toast.warning("تم التقاط الإحداثيات، ولكن تعذر ترجمتها لعنوان مكتوب")
					}
				} catch (error) {
					toast.error("حدث خطأ أثناء جلب تفاصيل العنوان")
					console.error(error)
				} finally {
					setIsLoading(false)
				}
			},
			(err) => {
				setIsLoading(false)
				switch (err.code) {
					case err.PERMISSION_DENIED:
						toast.error("يرجى السماح بالوصول للموقع من إعدادات المتصفح")
						break
					case err.TIMEOUT:
						toast.error("استغرق طلب الموقع وقتاً طويلاً، حاول مجدداً")
						break
					default:
						toast.error("حدث خطأ أثناء تحديد الموقع")
				}
			},
			options,
		)
	}, [])

	return (
		<Card>
			<CardHeader>
				<CardTitle>تحديد الموقع الجغرافي</CardTitle>
				<CardDescription>اضغط على الزر لتعبئة حقول البلد والمحافظة والمدينة تلقائياً عبر الـ GPS</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<Input name="lng" defaultValue={coords?.lng ?? ""} type="hidden" />
				<Input name="lat" defaultValue={coords?.lat ?? ""} type="hidden" />
				<Input name="country" defaultValue={address?.country ?? ""} type="hidden" />
				<Input name="state" defaultValue={address?.state ?? ""} type="hidden" />
				<Input name="city" defaultValue={address?.city ?? ""} type="hidden" />
				{/* --------------------------------- Button --------------------------------- */}
				<Button onClick={getMyLocation} disabled={isLoading} type="button" size={"lg"}>
					{isLoading ? <Loader2 /> : <MapPin />}
					{isLoading ? "جاري تحديد الموقع وقراءة العنوان..." : "تحديد موقعي الآن"}
				</Button>

				{/* --------------------------------- العنوان -------------------------------- */}
				{address && (
					<h6>
						{address.country ?? ""} - {address.state ?? ""} - {address.city ?? ""}
					</h6>
				)}
			</CardContent>

			{/* ----------------------- عرض الخريطة الحية للموقع ---------------------- */}
			{coords && (
				<CardFooter className="px-4 lg:px-6">
					<iframe
						width="100%"
						height="100%"
						className="border-2 rounded-lg border-primary md:aspect-video aspect-square"
						loading="lazy"
						allowFullScreen
						referrerPolicy="no-referrer-when-downgrade"
						src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=18&output=embed`}
					/>
				</CardFooter>
			)}
		</Card>
	)
}
