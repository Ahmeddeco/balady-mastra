import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { Toaster } from "@/components/ui/sonner"
import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react"

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			{/* TODO إضافة زركشة للخلفية */}
			<main className="min-h-dvh lg:pt-14 pt-12 ">{children}</main>
			<Toaster
				theme="system"
				richColors
				duration={5000}
				icons={{
					success: <CircleCheckBig />,
					warning: <CircleAlert />,
					error: <CircleX />,
				}}
			/>
			<Footer />
		</>
	)
}
