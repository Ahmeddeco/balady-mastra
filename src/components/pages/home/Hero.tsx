import ShopNowButton from "@/components/shared/ShopNowButton"
import TrustedBy from "@/components/shared/TrustedBy"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
	return (
		<div className="lg:h-[85vh] h-auto flex gap-0 items-center justify-center relative border-b bg-foreground text-background py-8  lg:py-0 mb-16 ">
			{/* ---------------------------- Right Image --------------------------- */}
			<div className="h-full lg:block hidden w-2/12 relative">
				<Image src={"/images/steakBlackDish.webp"} alt={"steak in Black Dish"} fill className="object-cover " />
			</div>

			{/* --------------------------- Main Section --------------------------- */}
			<section className="flex lg:flex-row flex-col items-center  lg:justify-evenly gap-8 min-h-[80vh] h-auto relative">
				{/* --------------------------------- title -------------------------------- */}
				<div className="flex  flex-col items-center lg:items-start gap-4 relative h-full ">
					<h1 className=" lg:text-start text-center ">
						بلدي <br />
						خبراء اللحوم
					</h1>
					<h4 className="max-w-md w-full ">
						نحن نضمن لك لحوماً بلدية 100%، مصدرها مزارعنا التي تتبع أعلى معايير التغذية الطبيعية. يتم اختيار المواشي
						بعناية فائقة لضمان طعم غني وقيمة غذائية عالية، بعيداً عن أي هرمونات أو إضافات صناعية.
					</h4>
					<ShopNowButton buttonSize={"lg"} />

					{/* -------------------------- trusted Clients -------------------------- */}
					<TrustedBy number={337} />
				</div>

				{/* -------------------------------- main Image --------------------------------- */}
				<div className="p-0 w-full max-w-[380px] sm:max-w-[450px] lg:max-w-none h-[380px] sm:h-[450px] lg:h-[700px] lg:w-[700px] relative aspect-square mx-auto lg:mx-0">
					<Image
						src={"/images/transparent/roaseBeaf.webp"}
						alt={"hero"}
						fill
						className="object-contain"
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
						fetchPriority="high"
					/>
				</div>
			</section>

			{/* --------------------------- Bottom Card -------------------------- */}
			<div className="absolute z-20 flex lg:flex-row flex-col items-center justify-center  gap-0 lg:left-1/2 lg:right-1/2 lg:-bottom-12 -bottom-16 h-fit w-fit py-2 px-12 ">
				<Button className="  flex flex-col items-start gap-0 h-fit lg:w-fit w-full rounded-none cursor-none lg:py-2">
					<h3 className="font-black">45 +</h3>
					<h6 className="text-nowrap">طن من اللحوم كل شهر</h6>
				</Button>
				<Button className=" flex flex-col items-start gap-0 h-fit lg:w-fit w-full rounded-none cursor-none py-2">
					<h3 className="font-black">37 +</h3>
					<h6 className="text-nowrap">نوع من منتجات اللحوم</h6>
				</Button>
			</div>
		</div>
	)
}
