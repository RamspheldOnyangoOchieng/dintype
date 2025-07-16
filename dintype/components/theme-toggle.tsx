"use client"

import React from "react"

import { Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  // Set the theme to light on component mount
  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <span className="sr-only">Light Mode</span>
    </div>
  )
}
