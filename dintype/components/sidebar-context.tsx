"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
  setIsOpen: (isOpen: boolean) => void
  isAdmin: boolean
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  setIsOpen: () => {},
  isAdmin: false,
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin") || false
  const isMounted = useRef(false)

  // Initialize based on screen size and handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMounted.current) return

      const isMobile = window.innerWidth < 768

      if (isMobile) {
        // On mobile, always start closed
        setIsOpen(false)
      } else {
        // On desktop, start with collapsed sidebar (not fully closed)
        setIsOpen(false) // Start collapsed by default
      }
    }

    // Set initial state
    if (typeof window !== "undefined") {
      isMounted.current = true
      handleResize()

      window.addEventListener("resize", handleResize)
      return () => {
        isMounted.current = false
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  // Close sidebar on route change on mobile only
  useEffect(() => {
    if (!isMounted.current) return

    // Only auto-close on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [pathname])

  // Add body class to handle global layout changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const body = document.body
      if (isOpen) {
        body.classList.add("sidebar-open")
        body.classList.remove("sidebar-closed")
      } else {
        body.classList.add("sidebar-closed")
        body.classList.remove("sidebar-open")
      }

      // Cleanup on unmount
      return () => {
        body.classList.remove("sidebar-open", "sidebar-closed")
      }
    }
  }, [isOpen])

  const toggle = () => {
    if (isMounted.current) {
      setIsOpen((prev) => !prev)
    }
  }

  const close = () => {
    if (isMounted.current) {
      setIsOpen(false)
    }
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, setIsOpen, isAdmin }}>{children}</SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
