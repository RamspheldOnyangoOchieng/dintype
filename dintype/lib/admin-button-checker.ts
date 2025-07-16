/**
 * Utility to check for button visibility issues in the admin panel
 * This can be used during development to identify potential issues
 */

export function checkButtonVisibility() {
  if (typeof window === "undefined") return

  // Find all buttons in the admin panel
  const adminPanel = document.querySelector(".admin-layout")
  if (!adminPanel) return

  const buttons = adminPanel.querySelectorAll('button, [role="button"]')
  const issues: string[] = []

  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(button)

    // Check if button is too small
    if (rect.width < 40 || rect.height < 40) {
      issues.push(`Button #${index} is too small (${rect.width}x${rect.height}px)`)
    }

    // Check if button is off-screen
    if (rect.left < 0 || rect.top < 0 || rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
      issues.push(`Button #${index} is partially off-screen`)
    }

    // Check for low contrast
    const backgroundColor = computedStyle.backgroundColor
    const color = computedStyle.color
    if (backgroundColor === "rgba(0, 0, 0, 0)" && button.classList.contains("bg-white")) {
      issues.push(`Button #${index} may have contrast issues (transparent background)`)
    }

    // Check for overflow issues
    if (computedStyle.overflow === "hidden" && button.scrollWidth > button.clientWidth) {
      issues.push(`Button #${index} has content that may be cut off`)
    }
  })

  return issues
}
