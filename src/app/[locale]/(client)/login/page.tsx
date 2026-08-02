"use client"

import SignIn from "@/auth/SignIn"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Home } from "lucide-react"
import Link from "next/link"
import { GrGoogle } from "react-icons/gr"

export default function LoginPage() {
	return (
		<Card className="container mx-auto lg:h-[85vh] h-[90vh] lg:mt-8 flex lg:flex-row flex-col-reverse items-center justify-center p-0 gap-0">
			{/* ------------------------------- login ------------------------------ */}
			<div className="flex-1 flex flex-col items-center justify-center size-full dark:bg-neutral-900 dark:text-neutral-100 gap-6 ">
				<h2>welcome back</h2>
				<h6>login to our amazing services</h6>
				<SignIn size="lg" variant="secondary" withTitle icon={GrGoogle} />

				<div className="flex items-center justify-center gap-4">
					<Separator orientation="horizontal" />
					<h6>OR</h6>
					<Separator orientation="horizontal" />
				</div>

				<Button asChild variant={"outline"}>
					<Link href={"/"}>
						<Home /> go to home page
					</Link>
				</Button>
			</div>
			{/* ------------------------------- image ------------------------------ */}
			<div className="flex-1 bg-[url('/images/planning.webp')] size-full bg-center bg-cover" />
		</Card>
	)
}
