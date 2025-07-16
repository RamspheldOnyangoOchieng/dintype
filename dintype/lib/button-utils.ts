/**
 * Utility functions for button accessibility and styling
 */

/**
 * Determines if text should be light or dark based on background color
 * to ensure proper contrast
 * @param backgroundColor - Hex color code (e.g., #FF4D8D)
 * @returns 'text-white' or 'text-gray-900' based on contrast needs
 */
export function getContrastText(backgroundColor: string): string {
  // Remove the # if it exists
  const hex = backgroundColor.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Calculate luminance - using the formula for relative luminance in the sRGB color space
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white text for dark backgrounds, dark text for light backgrounds
  return luminance > 0.5 ? "text-gray-900" : "text-white"
}

/**
 * Creates a class string for a button with proper contrast
 * @param baseClasses - Base Tailwind classes for the button
 * @param bgColorClass - Background color class (e.g., 'bg-blue-500')
 * @returns Combined class string with proper text contrast
 */
export function createButtonClasses(baseClasses: string, bgColorClass: string): string {
  // Extract the color from the bgColorClass
  // This is a simplified version - in a real app you might need a mapping of Tailwind classes to hex values
  const colorMap: Record<string, string> = {
    "bg-blue-500": "#3B82F6",
    "bg-red-500": "#EF4444",
    "bg-green-500": "#10B981",
    "bg-pink-500": "#EC4899",
    "bg-purple-500": "#8B5CF6",
    "bg-[#FF4D8D]": "#FF4D8D",
    // Add more mappings as needed
  }

  const hexColor = colorMap[bgColorClass] || "#000000"
  const textContrastClass = getContrastText(hexColor)

  return `${baseClasses} ${bgColorClass} ${textContrastClass}`
}
