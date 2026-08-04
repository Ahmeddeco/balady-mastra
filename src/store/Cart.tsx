"use client"

import { useCartStore } from "@/store/cartStore"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Currency } from "@/logic/currency"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { useCurrentLocale } from "@/locales/client.locale"
import CheckoutButton from "@/store/CheckoutButton"
import { Unit } from "@/generated/prisma/enums"

export default function Cart() {
	const { items, removeFromCart, updateQuantityByHalf, updateQuantityByOnes } = useCartStore((state) => state)

	const subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
	const tax = subTotal * 0.1 // Assuming 10% tax
	const total = subTotal + tax

	const locale = useCurrentLocale()

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="relative " size={"icon"} variant={"outline"}>
					<ShoppingCart />
					<div className="rounded-full bg-primary text-neutral-100 size-5 absolute -bottom-2 -right-2 flex items-center justify-center">
						<span className="text-xs font-medium">{items.length}</span>
					</div>
				</Button>
			</SheetTrigger>
			<SheetContent className="max-w-lg " dir="rtl">
				<SheetHeader>
					<SheetTitle className="text-center">{locale === "en" ? " cart items" : " سلة المشتريات"} </SheetTitle>
				</SheetHeader>
				<Separator />
				<ScrollArea className="flex flex-col gap-4 p-4 w-full h-full max-h-[60vh]">
					{items.map(({ id, mainImage, price, quantity, titleAr, titleEn, unit, stock }) => (
						<Item key={id} variant="default" role="listitem">
							<ItemMedia variant="image" className="relative aspect-square size-24">
								<Image
									src={mainImage}
									alt={locale === "en" ? titleEn : titleAr}
									fill
									className="object-cover rounded-md "
								/>
								<Button
									size={"icon-xs"}
									type="button"
									className=" absolute top-1 left-1 rounded-full z-20"
									onClick={() => removeFromCart(id)}
								>
									<X />
								</Button>
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="line-clamp-1">{locale === "en" ? titleEn : titleAr}</ItemTitle>
								<ItemDescription>{Currency(price, locale)}</ItemDescription>
								{/* -------------------------------- quantity -------------------------------- */}
								<div className=" flex items-center gap-1">
									{/* --------------------------- decrement --------------------------- */}
									<Button
										variant={"ghost"}
										size={"icon"}
										type="button"
										onClick={() => {
											if (unit === Unit.piece) {
												updateQuantityByOnes("decrement", id)
											} else {
												updateQuantityByHalf("decrement", id)
											}
										}}
										disabled={(unit === Unit.piece && quantity <= 1) || (unit === Unit.kg && quantity <= 0.5)}
									>
										<Minus />
									</Button>

									{/* -------------------------------- quantity -------------------------------- */}
									<Button size={"icon"} type="button" variant={"outline"} className="cursor-not-allowed">
										{quantity.toFixed(0)}
									</Button>

									{/* --------------------------- increment --------------------------- */}
									<Button
										variant={"ghost"}
										size={"icon"}
										type="button"
										onClick={() => {
											if (unit === Unit.piece) {
												updateQuantityByOnes("increment", id)
											} else {
												updateQuantityByHalf("increment", id)
											}
										}}
										disabled={quantity >= stock}
									>
										<Plus />
									</Button>
								</div>
							</ItemContent>
						</Item>
					))}
				</ScrollArea>
				<SheetFooter className="h-[30vh] ">
					<Card className="h-full">
						<CardContent className="flex flex-col gap-4 h-full">
							<div className="flex items-center justify-between">
								<h6>المجموع</h6>
								<p>{Currency(subTotal, locale)}</p>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<h6>الضريبة</h6>
								<p>{Currency(tax, locale)}</p>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<h6>الإجمالي</h6>
								<p>{Currency(total, locale)}</p>
							</div>
							{/* ----------------------------- CheckoutButton ----------------------------- */}
							<CheckoutButton />
						</CardContent>
					</Card>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
