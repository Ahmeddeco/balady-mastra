import Categories from "@/components/pages/home/Categories"
import Delivery from "@/components/pages/home/Delivery"
import Hero from "@/components/pages/home/Hero"
import WhyChooseUs from "@/components/pages/home/WhyChooseUs"

export default function HomePage() {
	return (
		<>
			<Hero />
			<Categories />
			<WhyChooseUs />
			<Delivery />
		</>
	)
}
