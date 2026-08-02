import ShopNowButton from "@/components/shared/ShopNowButton"
import TrustedBy from "@/components/shared/TrustedBy"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/locales/dictionaries"
import Image from "next/image"

type Props = {
	locale: "en" | "ar"
}

export default async function Hero({ locale }: Props) {
	const dic = await getDictionary(locale)

	return (
		<div className=" h-auto  flex gap-0 items-center justify-center w-full relative border-b py-8 lg:py-0 mb-16  ">
			{/* ---------------------------- Right Image --------------------------- */}
			<div className="absolute inset-x-0 h-full lg:block hidden w-2/12 ">
				<div className="h-full w-full relative">
					<Image src={"/images/steakBlackDish.webp"} alt={"steak in Black Dish"} fill className="object-cover " />
				</div>
			</div>

			{/* --------------------------- Main Section --------------------------- */}
			<section className="flex lg:flex-row flex-col items-center  lg:justify-end  w-full lg:w-10/12  gap-8 min-h-[80vh] h-auto relative">
				{/* --------------------------------- title -------------------------------- */}
				<div className="flex  flex-col items-center lg:items-start gap-4 relative h-full ">
					<h1 className=" lg:text-start text-center ">
						{dic.homePage.hero.title} <br />
						{dic.homePage.hero.titleBr}
					</h1>
					<h5 className="max-w-md w-full lg:text-start text-center text-balance ">{dic.homePage.hero.subTitle}</h5>
					<ShopNowButton buttonSize={"lg"} locale={locale} />

					{/* -------------------------- trusted Clients -------------------------- */}
					<TrustedBy number={337} locale={locale} />
				</div>

				{/* -------------------------------- main Image --------------------------------- */}
				<div className="p-0 w-full max-w-[380px] sm:max-w-[450px] lg:max-w-none h-[380px] sm:h-[450px] lg:h-[700px] lg:w-[700px] relative aspect-square mx-auto lg:mx-0">
					<Image
						src={"/images/transparent/roaseBeaf.webp"}
						alt={"hero"}
						fill
						className={`${locale === "en" && "rotate-y-180"}  object-contain`}
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
						fetchPriority="high"
					/>
				</div>
			</section>

			{/* --------------------------- Bottom Card -------------------------- */}
			<div className="absolute z-30 flex lg:flex-row flex-col items-center justify-center  gap-0 lg:left-1/2 lg:right-1/2 lg:-bottom-12 -bottom-16 h-fit w-fit py-2 px-12 ">
				<Button className="  flex flex-col items-start gap-0 h-fit  lg:w-fit w-full bg-primary! rounded-none cursor-none lg:py-2">
					<h3 className="font-black">45 +</h3>
					<h6 className="text-nowrap">{dic.homePage.hero.bottomCard.first}</h6>
				</Button>
				<Button className=" flex flex-col items-start gap-0 h-fit lg:w-fit w-full bg-primary! rounded-none cursor-none py-2">
					<h3 className="font-black">37 +</h3>
					<h6 className="text-nowrap">{dic.homePage.hero.bottomCard.second}</h6>
				</Button>
			</div>
		</div>
	)
}
