import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
	// Or a custom loading skeleton component
	return (
		<Card className="lg:h-[85vh] h-[90vh] lg:mt-8 flex lg:flex-row flex-col-reverse items-center justify-center p-0 gap-0">
			{/* ------------------------------- login ------------------------------ */}
			<div className="flex-1 flex flex-col items-center justify-center size-full dark:bg-neutral-900 dark:text-neutral-100 gap-6 ">
				<div className="flex flex-col gap-6 items-center w-full">
					<Skeleton className="h-4 w-full max-w-3xs" />
					<Skeleton className="h-4 w-full max-w-2xs" />
				</div>

				<Skeleton className="h-9 w-48" />
				<Skeleton className="h-0.5 w-full max-w-3xs" />
				<Skeleton className="h-9 w-48" />
			</div>
			{/* ------------------------------- image ------------------------------ */}
			<Skeleton className="flex-1 size-full " />
		</Card>
	)
}
