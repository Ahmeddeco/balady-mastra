import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Image from "next/image"
import { Separator } from "../ui/separator"

type Props = {
	className?: string
	image: string
	name: string
	job: string
	description: string
	color: "black" | "white"
}

export default function AvatarCard({ className, image, name, description, job, color = "black" }: Props) {
	return (
		<Card
			className={`${className} ${color === "white" ? "bg-foreground border-background border" : "bg-card border-foreground"} max-w-md  min-w-3xs `}
		>
			<CardHeader>
				<CardTitle className="flex items-center gap-4">
					<div className="relative aspect-square size-12">
						<Image
							src={image}
							alt={"customer"}
							fill
							className={`rounded-full ${color === "white" ? "border-foreground" : "border-background"} border`}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<h4 className={color === "black" ? "text-foreground" : "text-background"}>{name}</h4>
						<h6 className={color === "black" ? "text-foreground" : "text-background"}>{job}</h6>
					</div>
				</CardTitle>
				<Separator color={color === "white" ? "black" : "white"} />
			</CardHeader>
			<CardContent className="lg:line-clamp-4 line-clamp-6">
				<p className={`${color === "black" ? "text-foreground" : "text-background"} line-clamp-2`}>{description}</p>
			</CardContent>
		</Card>
	)
}
