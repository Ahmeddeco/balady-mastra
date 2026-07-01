/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import { CheckOutButton } from "@/components/shared/CustomButtons"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Unit } from "@/generated/prisma/enums"

export default function Cart() {
	const { items, removeFromCart, updateQuantityByHalf, updateQuantityByOnes } = useCartStore((state) => state)

	const subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
	const tax = subTotal * 0.1 // Assuming 10% tax
	const total = subTotal + tax

	return (
		<Sheet>
			<SheetTrigger>
				<div className="relative">
					<ShoppingCart />
					<div className="rounded-full bg-primary text-neutral-50 size-5 absolute -bottom-2 -right-2 flex items-center justify-center">
						<span className="text-xs font-medium">{items.length}</span>
					</div>
				</div>
			</SheetTrigger>
			<SheetContent className="max-w-lg " dir="rtl">
				<SheetHeader>
					<SheetTitle className="text-center flex items-center justify-center gap-2">
						<ShoppingCart className="text-primary" />
						سلة المشتريات
					</SheetTitle>
				</SheetHeader>
				<Separator />
				<ScrollArea className="flex flex-col gap-4 p-4 w-full h-full max-h-[60vh]">
					{items.map(({ id, image, price, quantity, stock, title, unit }) => (
						<Item key={id} variant="default" role="listitem">
							<ItemMedia variant="image" className="relative aspect-square size-24">
								<Image src={image} alt={title} fill className="object-cover rounded-md " />
								<Button
									size={"icon-xs"}
									variant={"destructive"}
									type="button"
									className=" absolute top-0 left-0 rounded-full z-20 bg-red-600! text-neutral-50"
									onClick={() => removeFromCart(id)}
								>
									<X />
								</Button>
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="line-clamp-1">{title}</ItemTitle>
								<ItemDescription>{Currency(price)}</ItemDescription>
								<div className=" flex items-center gap-1">
									{/* --------------------------- decrement --------------------------- */}
									<Button
										variant={"ghost"}
										size={"icon"}
										type="button"
										onClick={() => {
											unit === Unit.piece
												? updateQuantityByOnes("decrement", id)
												: updateQuantityByHalf("decrement", id)
										}}
										disabled={(unit === Unit.piece && quantity <= 1) || (unit === Unit.kg && quantity <= 0.5)}
									>
										<Minus />
									</Button>

									{/* -------------------------------- quantity -------------------------------- */}
									<Button size={"sm"} type="button" variant={"outline"} className="cursor-not-allowed">
										{quantity && quantity.toFixed(1)}
									</Button>

									{/* --------------------------- increment --------------------------- */}
									<Button
										variant={"ghost"}
										size={"icon"}
										type="button"
										onClick={() => {
											unit === Unit.piece
												? updateQuantityByOnes("increment", id)
												: updateQuantityByHalf("increment", id)
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
								<p>{Currency(subTotal)}</p>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<h6>الضريبة</h6>
								<p>{Currency(tax)}</p>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<h6>الإجمالي</h6>
								<p>{Currency(total)}</p>
							</div>

							{/* TODO Add a checkout method with payment service like paymob or kashir*/}
							<CheckOutButton />
						</CardContent>
					</Card>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
