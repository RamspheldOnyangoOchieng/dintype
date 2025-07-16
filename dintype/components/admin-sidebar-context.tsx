"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminSidebarContextType {
  collapsed: boolean
  toggleSidebar: () => void
}

const AdminSidebarContext = createContext<AdminSidebarContextType>({
  collapsed: false,
  toggleSidebar: () => {},
})

export function useAdminSidebar() {
  return useContext(AdminSidebarContext)
}

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available, otherwise default to false
  const [collapsed, setCollapsed] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedValue = localStorage.getItem("adminSidebarCollapsed")
    if (storedValue !== null) {
      setCollapsed(storedValue === "true")
    }
  }, [])

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(collapsed))
  }, [collapsed])

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev)
  }

  return <AdminSidebarContext.Provider value={{ collapsed, toggleSidebar }}>{children}</AdminSidebarContext.Provider>
}
