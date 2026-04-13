import ShopNowButton from "@/components/shared/ShopNowButton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/constants/home"
import React from "react"

export default function Categories() {
	return (
		<section className="flex flex-col items-center justify-center gap-16">
			<div className="flex flex-col items-center justify-center gap-2">
				<h2 className="text-center">
					نحن نقدم لحوم <br />
					من أجود الأنواع.
				</h2>
			</div>

			{/* ---------------------- CategoriesCards --------------------- */}
			<div className="flex flex-wrap items-center justify-center gap-8 ">
				{categories.map(({ description, icon, searchParams, title }, index) => (
					<Card
						key={index}
						className="w-full lg:w-md aspect-square even:bg-primary even:text-neutral-50 justify-center bg-card group-hover:scale-105"
					>
						<CardHeader className="flex flex-col gap-2 justify-center items-center">
							<CardTitle className="w-fit ">{React.createElement(icon, { size: 150 })}</CardTitle>
							<CardDescription
								className={`text-2xl capitalize font-extrabold ${
									index % 2 === 0 ? "text-foreground" : "text-neutral-50"
								} `}
							>
								{title}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<h6 className="text-center text-balance">{description}</h6>
						</CardContent>
						<CardFooter className="justify-center">
							<ShopNowButton
								searchParams={searchParams}
								buttonVariant={index % 2 === 0 ? "default" : "outline"}
								buttonSize={"lg"}
							/>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	)
}
