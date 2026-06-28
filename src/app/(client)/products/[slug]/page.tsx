import { AddToCart } from "@/components/shared/CustomButtons"
import ImageSlider from "@/components/shared/ImageSlider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getOneProductBySlug } from "@/dl/products.data"
import { Currency, finalPrice } from "@/logic/currency"
import { getOneProductBySlugType } from "@/types/Product.type"

type Props = {
	params: Promise<{ slug: string }>
}

export default async function OneProductPage({ params }: Props) {
	const rawSlug = (await params).slug
	const slug = decodeURIComponent(rawSlug)
	const product: getOneProductBySlugType = await getOneProductBySlug(slug)

	return (
		<section className="flex lg:flex-row flex-col gap-8">
			{/* ---------------------------- ImageSlider --------------------------- */}
			<div className="flex-1 ">
				<ImageSlider
					mainImage={product?.mainImage ?? "/images/noImage.svg"}
					images={product?.images ?? []}
					alt={product?.title ?? "meat"}
				/>
			</div>

			{/* ---------------------------- Information --------------------------- */}
			<Card className="flex-1 ">
				<CardContent className="flex flex-col gap-4">
					<h2>{product?.title}</h2>
					<h6>{product?.description}</h6>

					{/* category & cut */}
					<div className="flex items-center  gap-4">
						<Badge>{product?.category}</Badge>
						<Badge>{product?.cut}</Badge>
					</div>

					{/* السعر */}
					<h4>
						السعر :{" "}
						<span className="text-xl font-bold ">{finalPrice(product?.price ?? 0, product?.discount ?? 0)}</span> /{" "}
						{product?.unit}
						<span className="line-through text-muted-foreground text-lg font-semibold mr-4">
							{Currency(product?.price ?? 0)}
						</span>
					</h4>
				</CardContent>
				{/* AddToCart */}
				<CardFooter>
					<AddToCart product={product} />
				</CardFooter>
			</Card>
		</section>
	)
}
