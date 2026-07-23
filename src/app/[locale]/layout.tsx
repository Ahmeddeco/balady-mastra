import type { Metadata, Viewport } from "next"
import "../globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react"
import Footer from "@/components/layout/Footer"
import localFont from "next/font/local"
import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UploadthingSSRPlugin } from "@/utils/uploadthing-plugin"

/* -------------------------------- localFont ------------------------------- */
const cairo = localFont({
	src: "../../../public/fonts/Cairo.ttf",
	variable: "--cairo-font",
})

/* -------------------------------- APP_INFO -------------------------------- */
const APP_NAME = "Balady"
const APP_DEFAULT_TITLE = "Balady | The First Smart Meat Shop "
const APP_TITLE_TEMPLATE = "%s - Balady"
const APP_DESCRIPTION = "أول منصة ذكية لبيع اللحوم البلدية."
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
	? process.env.NEXT_PUBLIC_APP_URL
	: process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://balady-eg.vercel.app/"

/* -------------------------------- Metadata -------------------------------- */
export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),

	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: APP_NAME,
	},
	formatDetection: {
		telephone: false,
	},
	icons: {
		icon: [
			{ url: "/icons/manifest-icon-192.maskable.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/manifest-icon-512.maskable.png", sizes: "512x512", type: "image/png" },
		],
		apple: [{ url: "/icons/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
}

/* -------------------------------- Viewport -------------------------------- */
export const viewport: Viewport = {
	themeColor: "#e11421",
}

/* -------------------------- generateStaticParams -------------------------- */
export function generateStaticParams() {
	return [{ locale: "ar" }, { locale: "en" }]
}

/* ------------------------------- RootLayout ------------------------------- */
export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const locale = (await params).locale

	return (
		<html
			lang={locale}
			dir={locale === "ar" ? "rtl" : "ltr"}
			className={`h-full antialiased ${cairo.className}`}
			suppressHydrationWarning
		>
			<body className="scroll-smooth min-h-screen w-full overflow-x-hidden">
				<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
					<UploadthingSSRPlugin />
					<TooltipProvider>
						<DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>{children}</DirectionProvider>
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
					</TooltipProvider>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}
