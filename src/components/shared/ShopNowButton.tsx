import Link from "next/link"
import { Button } from "../ui/button"
import { ShoppingCart } from "lucide-react"
import { Category } from "@/generated/prisma/enums"
import { type VariantProps } from "class-variance-authority"

type ButtonVariant = VariantProps<typeof Button>["variant"]
type ButtonSize = VariantProps<typeof Button>["size"]

type Props = {
	searchParams?: Category
	buttonVariant?: ButtonVariant
	buttonSize?: ButtonSize
	locale: "en" | "ar"
}

export default function ShopNowButton({
	searchParams,
	buttonVariant = "default",
	buttonSize = "sm",
	locale,
}: Props) {
	return (
		<Button asChild variant={buttonVariant} size={buttonSize}>
			<Link href={searchParams ? `/products/?category=${searchParams}` : `/products`}>
				<ShoppingCart /> {locale === "en" ? "shopping now" : "تسوق الآن"}
			</Link>
		</Button>
	)
}
