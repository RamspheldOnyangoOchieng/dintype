"use client"

import { useEffect } from "react"
import { useAdminSidebar } from "./admin-sidebar-context"

export function AdminSidebarController() {
  const { collapsed } = useAdminSidebar()

  useEffect(() => {
    // Get all sidebar elements
    const sidebarElements = document.querySelectorAll(".sidebar-width")
    // Get all content margin elements
    const contentElements = document.querySelectorAll(".content-margin")

    // Update classes based on collapsed state
    sidebarElements.forEach((element) => {
      if (collapsed) {
        element.classList.add("collapsed")
      } else {
        element.classList.remove("collapsed")
      }
    })

    contentElements.forEach((element) => {
      if (collapsed) {
        element.classList.add("sidebar-collapsed")
      } else {
        element.classList.remove("sidebar-collapsed")
      }
    })
  }, [collapsed])

  return null
}
