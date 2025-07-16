import type React from "react"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import ClientRootLayout from "./ClientRootLayout"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import { getPageSeo } from "@/lib/get-seo"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/")

  return {
    title: {
      default: "Dintyp.se",
      template: "%s | Dintyp.se",
    },
    description: "Dintyp.se - Din AI-följeslagare",
    keywords: seo.keywords.split(",").map((k) => k.trim()),
    openGraph: {
      title: "Dintyp.se",
      description: "Dintyp.se - Din AI-följeslagare",
      images: [seo.ogImage],
      siteName: "Dintyp.se",
      url: seo.siteUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Dintyp.se",
      description: "Dintyp.se - Din AI-följeslagare",
      creator: seo.twitterHandle,
      images: [seo.ogImage],
    },
    metadataBase: new URL(seo.siteUrl),
    applicationName: "Dintyp.se",
    appleWebApp: {
      title: "Dintyp.se",
    },
    generator: "Dintyp.se",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientRootLayout>
            <div className="flex-1 flex flex-col">{children}</div>
            <MobileNav />
          </ClientRootLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
