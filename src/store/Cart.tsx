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
					<SheetTitle className="text-center">سلة المشتريات</SheetTitle>
				</SheetHeader>
				<Separator />
				<ScrollArea className="flex flex-col gap-4 p-4 w-full h-full max-h-[60vh]">
					{items.map(({ id, image, price, quantity, title, increaseByOne }) => (
						// <div key={id} className="h-full">
						// 	<div className="flex items-start p-2 gap-4  justify-between h-full">
						// 		<div className="w-1/4 relative aspect-square">
						// 			<Image src={image} alt={title} fill className="rounded-md object-cover" />
						// 		</div>
						// 		<div className="w-3/4 flex items-start justify-between h-full ">
						// 			{/* ---------------------------------- Text ---------------------------------- */}
						// 			<div className="flex flex-col gap-1 h-full">
						// 				<h6>{title}</h6>
						// 				<p className="text-xs">{price.toFixed(2)}</p>

						// 				{/* -------------------------------- quantity -------------------------------- */}
						// 				<div className=" flex items-center gap-1">
						// 					<Button
						// 						variant={"ghost"}
						// 						size={"icon"}
						// 						type="button"
						// 						onClick={() => {
						// 							increaseByOne ? updateQuantityByOnes("decrement", id) : updateQuantityByHalf("decrement", id)
						// 						}}
						// 					>
						// 						<Minus />
						// 					</Button>
						// 					<Button size={"sm"} type="button" variant={"outline"} className="cursor-not-allowed">
						// 						{quantity.toFixed(1)}
						// 					</Button>
						// 					<Button
						// 						variant={"ghost"}
						// 						size={"icon"}
						// 						type="button"
						// 						onClick={() => {
						// 							increaseByOne ? updateQuantityByOnes("increment", id) : updateQuantityByHalf("increment", id)
						// 						}}
						// 					>
						// 						<Plus />
						// 					</Button>
						// 				</div>
						// 			</div>

						// 			{/* ---------------------------------- Total --------------------------------- */}
						// 			<div className="flex flex-col items-center justify-end gap-6 h-full">
						// 				<Button size={"icon"} type="button" className="rounded-full" onClick={() => removeFromCart(id)}>
						// 					<X />
						// 				</Button>
						// 				<p className="text-sm font-medium text-foreground">الإجمالي : {(price * quantity).toFixed(2)}</p>
						// 			</div>
						// 		</div>
						// 	</div>
						// </div>

						<Item key={id} variant="default" role="listitem">
							<ItemMedia variant="image" className="relative aspect-square size-24">
								<Image src={image} alt={title} fill className="object-cover rounded-md " />
								<Button
									size={"icon"}
									variant={"destructive"}
									type="button"
									className=" absolute top-0 left-0 rounded-full z-20"
									onClick={() => removeFromCart(id)}
								>
									<X />
								</Button>
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="line-clamp-1">{title}</ItemTitle>
								<ItemDescription>{Currency(price)}</ItemDescription>
								{/* -------------------------------- quantity -------------------------------- */}
								<div className=" flex items-center gap-1">
									<Button
										variant={"ghost"}
										size={"icon"}
										type="button"
										onClick={() => {
											increaseByOne ? updateQuantityByOnes("decrement", id) : updateQuantityByHalf("decrement", id)
										}}
									>
										<Minus />
									</Button>
									<Button size={"sm"} type="button" variant={"outline"} className="cursor-not-allowed">
										{quantity.toFixed(1)}
									</Button>
									<Button
										variant={"ghost"}
										size={"icon"}
										type="button"
										onClick={() => {
											increaseByOne ? updateQuantityByOnes("increment", id) : updateQuantityByHalf("increment", id)
										}}
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
