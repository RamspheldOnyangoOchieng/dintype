import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import ClientRootLayout from "./ClientRootLayout"
import MobileNav from "@/components/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Dintyp.se</title>
        <meta name="description" content="Dintyp.se - Din AI-följeslagare" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="application-name" content="Dintyp.se" />
        <meta name="apple-mobile-web-app-title" content="Dintyp.se" />
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

export const metadata = {
      generator: 'v0.dev'
    };
