import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { faker } from "@faker-js/faker"

type Props = {
	number?: number
	locale: "en" | "ar"
}
export default function TrustedBy({ number = 273, locale }: Props) {
	return (
		<div className="flex flex-col gap-2 w-full items-center lg:items-start">
			<div className="flex items-center gap-4">
				<h5 className="uppercase">
					<b>{locale === "en" ? "Trusted by" : "حائز على ثقة"} </b>
					{locale === "en" ? "More than" : "أكتر من"} {number} {locale === "en" ? "Clients" : "عميل"}
				</h5>
			</div>
			<div className="-space-x-2 flex ">
				{Array.from({ length: 5 }).map((_, index) => (
					<Avatar key={index} className="border border-primary">
						<AvatarImage src={faker.image.personPortrait()} />
						<AvatarFallback>{faker.person.firstName().charAt(0)}</AvatarFallback>
					</Avatar>
				))}
			</div>
		</div>
	)
}
