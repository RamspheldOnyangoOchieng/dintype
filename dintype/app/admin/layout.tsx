import type { ReactNode } from "react"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"
import AdminSidebar from "@/components/admin-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import "../admin-styles.css"
import "./admin-button-fixes.css" // Add our button fixes

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="admin-layout">
        <ErrorBoundary>
          <AdminSidebarProvider>
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="admin-content">
              <div className="admin-content-inner">
                <ErrorBoundary>{children}</ErrorBoundary>
              </div>
            </main>
          </AdminSidebarProvider>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  )
}
