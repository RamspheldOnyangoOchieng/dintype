"use client"

import React from "react"
import { usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminGuard } from "@/components/admin-guard"
import { cn } from "@/lib/utils"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem('admin_sidebar_collapsed')
    if (stored === 'true') setIsCollapsed(true)
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('admin_sidebar_collapsed', newState.toString())
  }

  // Public admin routes that don't need the sidebar or guard
  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/signup'

  if (isPublicAdminRoute) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  if (!isMounted) return <div className="min-h-screen bg-background" />

  return (
    <AdminGuard>
      <div
        className={cn(
          "grid h-screen w-full overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[280px_1fr]"
        )}
      >
        <div className="hidden border-r bg-card text-card-foreground lg:block overflow-hidden h-screen">
          <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        </div>
        <div className="flex flex-col min-w-0 h-screen overflow-hidden">
          <AdminHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-background" key={pathname}>
            <div className="min-w-0 w-full max-w-full overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}

export default AdminLayout
