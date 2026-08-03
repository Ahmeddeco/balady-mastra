import ShopNowButton from "@/components/shared/ShopNowButton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/constants/home"
import { getDictionary } from "@/locales/dictionaries"
import React from "react"

type Props = {
	locale: "en" | "ar"
}

export default async function Categories({ locale }: Props) {
	const dic = await getDictionary(locale)

	return (
		<section className="flex flex-col items-center justify-center gap-16 container mx-auto">
			<div className="flex flex-col items-center justify-center gap-2">
				<h2 className="text-center">
					{dic.homePage.categoriesSection.title}
					<br />
					{dic.homePage.categoriesSection.titleBr}
				</h2>
			</div>

			{/* ---------------------- CategoriesCards --------------------- */}
			<div className="flex flex-wrap items-center justify-center gap-8 ">
				{dic.homePage.categoriesSection.categories.map(({ description, icon, searchParams, title }, index) => (
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
							<h6 className="text-center text-pretty">{description}</h6>
						</CardContent>
						<CardFooter className="justify-center">
							<ShopNowButton
								searchParams={searchParams}
								buttonVariant={index % 2 === 0 ? "default" : "outline"}
								buttonSize={"lg"}
								locale={locale}
							/>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	)
}
