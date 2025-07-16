import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { getButtonSpacing } from "@/lib/admin-button-utils"

interface ButtonGroupProps {
  children: ReactNode
  direction?: "horizontal" | "vertical"
  className?: string
  stackOnMobile?: boolean
}

export function ButtonGroup({
  children,
  direction = "horizontal",
  className = "",
  stackOnMobile = false,
}: ButtonGroupProps) {
  return (
    <div className={cn("button-container", getButtonSpacing(direction), stackOnMobile && "stack-mobile", className)}>
      {children}
    </div>
  )
}
