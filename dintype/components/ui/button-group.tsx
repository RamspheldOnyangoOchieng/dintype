import type * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean
  spacing?: "tight" | "normal" | "loose"
  children: React.ReactNode
}

export function ButtonGroup({ className, vertical = false, spacing = "normal", children, ...props }: ButtonGroupProps) {
  const spacingClasses = {
    tight: vertical ? "space-y-1" : "space-x-1",
    normal: vertical ? "space-y-2" : "space-x-2",
    loose: vertical ? "space-y-4" : "space-x-4",
  }

  return (
    <div
      className={cn(
        "flex",
        vertical ? "flex-col" : "flex-row flex-wrap",
        spacingClasses[spacing],
        vertical ? "" : "items-center",
        className,
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  )
}
