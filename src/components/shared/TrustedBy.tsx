import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { faker } from "@faker-js/faker"

type Props = {
	number?: number
}
export default function TrustedBy({ number = 200 }: Props) {
	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex items-center gap-4">
				<h4 className="uppercase">حائز على ثقة</h4>
				<h5>أكتر من {number} عميل</h5>
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
