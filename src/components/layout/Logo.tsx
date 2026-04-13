import Link from "next/link"
import { GiMeatCleaver } from "react-icons/gi"

export default function Logo() {
	return (
		<Link href="/" className="flex items-end justify-center gap-1">
			<GiMeatCleaver className="size-9 text-primary " />
			<h3 className="tracking-wider  font-black ">بلدي</h3>
		</Link>
	)
}
