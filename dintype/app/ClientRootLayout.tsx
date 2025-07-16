"use client"

import type React from "react"
import "./globals.css"
import { SiteProvider } from "@/components/site-context"
import { SidebarProvider, useSidebar } from "@/components/sidebar-context"
import { AuthProvider } from "@/components/auth-context"
import { CharacterProvider } from "@/components/character-context"
import { ImageSuggestionsProvider } from "@/components/image-suggestions-context"
import { BannerProvider } from "@/components/banner-context"
import AppSidebar from "@/components/app-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { LanguageProvider } from "@/components/language-context"
import { usePathname } from "next/navigation"

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - only show on non-admin pages */}
      {!isAdminPage && <AppSidebar />}

      {/* Main content area - always responds to sidebar state */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          !isAdminPage ? `${isOpen ? "ml-[251px]" : "ml-[59px]"} md:${isOpen ? "ml-[251px]" : "ml-[59px]"}` : "ml-0"
        }`}
        style={{
          // Ensure content always has proper spacing
          marginLeft: !isAdminPage ? (isOpen ? "251px" : "59px") : "0px",
        }}
      >
        <div className="w-full">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  )
}

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProvider>
      <LanguageProvider>
        <AuthProvider>
          <SidebarProvider>
            <CharacterProvider>
              <BannerProvider>
                <ImageSuggestionsProvider>
                  <RootLayoutContent>{children}</RootLayoutContent>
                </ImageSuggestionsProvider>
              </BannerProvider>
            </CharacterProvider>
          </SidebarProvider>
        </AuthProvider>
      </LanguageProvider>
    </SiteProvider>
  )
}
