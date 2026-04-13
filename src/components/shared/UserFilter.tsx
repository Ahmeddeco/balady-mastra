import Form from "next/form"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Category, Role } from "@/generated/prisma/enums"
import { User } from "@/schemas/UserSchema"

type Props = {
	activeRole: Role | undefined
}
export default function UserFilter({ activeRole }: Props) {
	return (
		<div className="flex items-center  gap-2">
			<Form action={""}>
				<Button type="submit" variant={activeRole === undefined ? "default" : "ghost"} size={"sm"}>
					all
				</Button>
			</Form>

			{Object.values(Role).map((role, index) => (
				<Form action={""} key={index} className="p-x-2">
					<Input type="hidden" name="role" value={role ?? ""} />
					<Button type="submit" variant={activeRole === role ? "default" : "ghost"} size={"sm"}>
						{role}
					</Button>
				</Form>
			))}
		</div>
	)
}
