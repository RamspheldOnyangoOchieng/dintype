import type * as React from "react"
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface AdminButtonProps extends BaseButtonProps {
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function AdminButton({
  children,
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  ...props
}: AdminButtonProps) {
  // Admin-specific button styling with new #00ccff color
  const adminButtonStyles = cn(
    // Ensure buttons are visible against white backgrounds
    variant === "outline" && "border-[#00ccff] hover:bg-[#e6faff] text-gray-900",
    // Use the new #00ccff color for primary buttons
    variant === "default" && "bg-[#00ccff] hover:bg-[#00b8e6] text-black shadow-sm",
    // Ensure consistent font weight
    "font-medium",
    // Add additional classes
    className,
  )

  return (
    <BaseButton
      variant={variant}
      size={size}
      className={adminButtonStyles}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </BaseButton>
  )
}
