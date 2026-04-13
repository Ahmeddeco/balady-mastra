import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import NextAuthProvider from "@/components/auth/NextAuthProvider"
import { TooltipProvider } from "@/components/ui/tooltip"

const cairo = localFont({
	src: "../../public/fonts/Cairo.ttf",
})

export const metadata: Metadata = {
	title: "Balady | Egyptian Meat",
	description: "Egyptian fresh meat app",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ar" dir="rtl" suppressHydrationWarning>
			<body className={`${cairo.className} antialiased`} suppressHydrationWarning>
				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<NextAuthProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</NextAuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
