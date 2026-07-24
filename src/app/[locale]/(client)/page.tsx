import Categories from "@/components/pages/home/Categories"
import Delivery from "@/components/pages/home/Delivery"
import Hero from "@/components/pages/home/Hero"
import WhyChooseUs from "@/components/pages/home/WhyChooseUs"

type Props = {
	params: Promise<{ locale: "en" | "ar" }>
}

export default async function HomePage({ params }: Props) {
	const locale = (await params).locale

	return (
		<>
			<Hero locale={locale} />
			<Categories locale={locale} />
			<WhyChooseUs locale={locale} />
			<Delivery locale={locale} />
		</>
	)
}
