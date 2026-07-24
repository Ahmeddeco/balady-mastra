import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Map } from "lucide-react"

type Props = {
	lat: string
	lng: string
}

export default function MapDialog({ lat, lng }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"outline"}>
					<Map /> عرض الموقع على الخريطة
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[80vw] w-5xl aspect-square">
				<iframe
					width="100%"
					height="100%"
					className="border-2 rounded-lg border-primary md:aspect-video aspect-square"
					loading="lazy"
					allowFullScreen
					referrerPolicy="no-referrer-when-downgrade"
					src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
				/>
			</DialogContent>
		</Dialog>
	)
}
