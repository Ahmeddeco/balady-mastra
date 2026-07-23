"use client"
import { useChangeLocale, useCurrentLocale } from "@/locales/client.locale"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LanguageButton() {
	const changeLocale = useChangeLocale()
	const locale = useCurrentLocale()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					{locale}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center">
				<DropdownMenuItem onClick={() => changeLocale("ar")}>Ar</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeLocale("en")}>En</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
