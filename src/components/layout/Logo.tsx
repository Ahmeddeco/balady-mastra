"use client"

import { useCurrentLocale } from "@/locales/client.locale"
import Image from "next/image"
import Link from "next/link"

export default function Logo() {
	const locale = useCurrentLocale()

	return (
		<Link href="/" className="flex items-end justify-center gap-0.5">
			<div className="relative h-10 w-fit aspect-square ">
				<Image
					src={"/icons/balady.ico"}
					alt={"logo"}
					fill
					className={`object-contain ${locale === "en" ? "object-right" : "object-left"}`}
				/>
			</div>
			<h2 className="lowercase ">{locale === "en" ? "alady" : "بلدي"}</h2>
		</Link>
	)
}
