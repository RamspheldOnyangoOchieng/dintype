"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAdminSidebar } from "./admin-sidebar-context"

interface AdminSidebarToggleProps {
  showOnlyOnCollapsed?: boolean
}

export function AdminSidebarToggle({ showOnlyOnCollapsed }: AdminSidebarToggleProps) {
  const { collapsed, toggleSidebar } = useAdminSidebar()

  // If showOnlyOnCollapsed is true and sidebar is not collapsed, don't show the toggle
  if (showOnlyOnCollapsed && !collapsed) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="text-gray-400 hover:text-white"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
    </Button>
  )
}
