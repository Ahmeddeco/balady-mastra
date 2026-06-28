import { toggleFavoriteAction } from "@/actions/favorite.action"
import { Heart } from "lucide-react"
import { Button } from "../ui/button"
import Form from "next/form"

interface Props {
	productId: string | undefined
	userId: string | undefined
	isFavorite: boolean
}

export default async function FavoriteButton({ productId, userId, isFavorite }: Props) {
	return (
		<Form action={toggleFavoriteAction}>
			<input type="hidden" name="productId" value={productId} />
			<input type="hidden" name="userId" value={userId} />
			<input type="hidden" name="isFavorite" value={String(isFavorite)} />

			<Button type="submit" size={"icon-lg"} variant={"ghost"}>
				<Heart stroke={isFavorite ? "red" : "white"} fill={isFavorite ? "red" : "white"} />
			</Button>
		</Form>
	)
}
