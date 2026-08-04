import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Eye, ImageOff } from "lucide-react"
import { Currency, finalPrice } from "@/logic/currency"
import Link from "next/link"
import { getAllProductsForProductsPageType, SingleProductPageType } from "@/types/Product.type"
import { Badge } from "@/components/ui/badge"
import AddToCart from "@/store/AddToCart"
import { Button } from "@/components/ui/button"
import FavoriteButton from "@/components/shared/FavoriteButton"
import { CartItem } from "@/store/cartStore"

type Props = {
	product: SingleProductPageType
	authId: string | null
	locale: "en" | "ar"
}

export default function ProductCard({ product, authId, locale }: Props) {
	const isFavorite = product?.favorites?.some((fav) => fav.userId === authId) ?? false
	// const formattedProduct:CartItem={id:product.id,mainImage:product.mainImage,price:product.price,quantity:product.}

	return (
		<Card className="overflow-hidden group">
			<CardHeader>
				<div className="relative aspect-video">
					{!product?.mainImage ? (
						<ImageOff />
					) : (
						<Image src={product?.mainImage} alt={product?.titleEn} fill className="object-cover rounded-t-xl" />
					)}

					{product?.discount && product.discount > 0 && (
						<Badge className="absolute top-2 left-2 ">خصم {product?.discount} %</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between ">
					<div className="flex items-center gap-2">
						<Badge variant={"outline"}>{product?.category}</Badge>
						<Badge variant={"outline"}>{product?.unit}</Badge>
					</div>
					{authId && <FavoriteButton productId={product?.id} userId={authId} isFavorite={isFavorite} />}
				</div>
				<h4 className="line-clamp-1">{locale === "en" ? product?.titleEn : product.titleAr}</h4>
				<h4 className="line-through text-muted-foreground">{Currency(+product?.price, locale)}</h4>
				<h2>{finalPrice(+product?.price, product?.discount ?? 0, locale)}</h2>
			</CardContent>

			{/* ------------------------------ CardFooter ----------------------------- */}
			<CardFooter className="flex flex-col items-center justify-center gap-4 ">
				{/* AddToCart */}
				<AddToCart product={product} />
				<Button variant={"outline"} asChild size={"full"}>
					<Link href={`/products/${product?.slug}`}>
						<Eye />
						شاهد المزيد
					</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
