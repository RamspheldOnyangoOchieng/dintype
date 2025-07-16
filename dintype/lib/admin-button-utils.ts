import { cn } from "@/lib/utils"

/**
 * Utility function to generate consistent admin button styles
 * @param variant Button variant (primary, secondary, destructive, outline, ghost)
 * @param size Button size (sm, md, lg)
 * @param additionalClasses Any additional classes to apply
 * @returns A string of Tailwind classes for the button
 */
export function getAdminButtonStyles(
  variant: "primary" | "secondary" | "destructive" | "outline" | "ghost" = "primary",
  size: "sm" | "md" | "lg" = "md",
  additionalClasses = "",
): string {
  // Base styles for all admin buttons
  const baseStyles =
    "rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ccff]"

  // Size variations
  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  }

  // Variant styles with new primary color #00ccff
  const variantStyles = {
    primary: "bg-[#00ccff] hover:bg-[#00b8e6] text-black shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300",
    destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    outline: "border border-[#00ccff] bg-white hover:bg-[#e6faff] text-gray-900",
    ghost: "bg-transparent hover:bg-[#e6faff] text-gray-700",
  }

  return cn(baseStyles, sizeStyles[size], variantStyles[variant], additionalClasses)
}

/**
 * Utility function to ensure buttons have proper spacing in layouts
 * @param direction The direction of the button group (horizontal or vertical)
 * @returns A string of Tailwind classes for button spacing
 */
export function getButtonSpacing(direction: "horizontal" | "vertical" = "horizontal"): string {
  return direction === "horizontal"
    ? "space-x-3" // Horizontal spacing
    : "space-y-3" // Vertical spacing
}

/**
 * Ensures icon buttons have proper sizing and padding
 * @param size Button size (sm, md, lg)
 * @returns A string of Tailwind classes for icon buttons
 */
export function getIconButtonStyles(size: "sm" | "md" | "lg" = "md"): string {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return cn(
    "flex items-center justify-center rounded-md transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ccff]",
    "bg-[#00ccff] hover:bg-[#00b8e6] text-black",
    sizeMap[size],
  )
}
