/**
 * Utility functions for theme-related styling
 */

import { cn } from "@/lib/utils"

/**
 * Ensures buttons have proper contrast in both light and dark modes
 * @param baseClasses - Base Tailwind classes
 * @param isDarkMode - Whether dark mode is active
 * @returns Combined class string with proper contrast for current theme
 */
export function getThemeAwareButtonClasses(baseClasses: string, isDarkMode: boolean): string {
  // Base button classes that work well in both modes
  const baseButtonClasses =
    "rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  // Light mode specific classes
  const lightModeClasses = "bg-blue-600 text-white hover:bg-blue-700"

  // Dark mode specific classes
  const darkModeClasses = "bg-blue-500 text-white hover:bg-blue-600"

  return cn(baseButtonClasses, isDarkMode ? darkModeClasses : lightModeClasses, baseClasses)
}

/**
 * Ensures text has proper contrast against its background in both light and dark modes
 * @param isDarkMode - Whether dark mode is active
 * @returns Text color class with proper contrast
 */
export function getContrastTextForTheme(isDarkMode: boolean): string {
  return isDarkMode ? "text-gray-100" : "text-gray-900"
}
