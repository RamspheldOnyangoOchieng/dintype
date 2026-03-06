import type React from "react"
import "./globals.css"
import "../styles/buttons.css"
import { Poppins } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { AuthProvider } from "@/components/auth-context"
import { AuthModalProvider } from "@/components/auth-modal-context"
import ClientRootLayout from "./ClientRootLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { getPageMetadata } from "@/lib/page-metadata"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
})

export async function generateMetadata(): Promise<Metadata> {
  const baseMeta = await getPageMetadata('/')

  return {
    ...baseMeta,
    icons: {
      icon: [
        {
          url: "/favicon.png",
          type: "image/png",
        },
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
        },
      ],
      apple: "/apple-touch-icon.png",
    },
    generator: 'v0.dev'
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={cn("font-sans antialiased overflow-x-hidden", poppins.variable)} style={{ margin: 0, padding: 0, position: 'relative', top: 0, background: 'transparent', backgroundColor: 'transparent' }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <AuthModalProvider>
              <ClientRootLayout>
                {children}
              </ClientRootLayout>
            </AuthModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}