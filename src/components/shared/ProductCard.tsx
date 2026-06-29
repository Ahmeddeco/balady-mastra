import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "../ui/button"
import { Eye, ImageOff } from "lucide-react"
import { Badge } from "../ui/badge"
import { Currency, finalPrice } from "@/logic/currency"
import Link from "next/link"
import { AddToCart } from "./CustomButtons"
import { SingleProductPageType } from "@/types/Product.type"
import FavoriteButton from "./FavoriteButton"

type Props = {
	product: SingleProductPageType
	authId: string | null
}

export default function ProductCard({ product, authId }: Props) {
	const isFavorite = product?.favorites?.some((fav) => fav.userId === authId) ?? false

	return (
		<Card className="overflow-hidden group">
			<CardHeader>
				<div className="relative aspect-video">
					{!product?.mainImage ? (
						<ImageOff />
					) : (
						<Image src={product?.mainImage} alt={product?.title} fill className="object-cover rounded-t-xl" />
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
				<h4>{product?.title}</h4>
				<h4 className="line-through text-muted-foreground">{Currency(+product?.price)}</h4>
				<h2>{finalPrice(+product?.price, product?.discount ?? 0)}</h2>
			</CardContent>

			{/* ------------------------------ CardFooter ----------------------------- */}
			<CardFooter className="flex items-center justify-center gap-2 ">
				{/* AddToCart */}
				<AddToCart product={product} />
				<Button className="lg:flex-1" variant={"outline"} asChild>
					<Link href={`/products/${product?.slug}`}>
						<Eye />
						شاهد المزيد
					</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
