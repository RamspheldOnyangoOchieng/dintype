"use client"

import { useState, useEffect } from "react"

type ButtonSize = "sm" | "default" | "lg" | "icon" | "wide"

/**
 * Hook to determine the appropriate button size based on screen width
 * @param defaultSize - The default button size to use
 * @param mobileSize - The button size to use on mobile devices
 * @returns The appropriate button size for the current screen width
 */
export function useResponsiveButtonSize(
  defaultSize: ButtonSize = "default",
  mobileSize: ButtonSize = "default",
): ButtonSize {
  const [buttonSize, setButtonSize] = useState<ButtonSize>(defaultSize)

  useEffect(() => {
    // Function to update button size based on window width
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setButtonSize(mobileSize)
      } else {
        setButtonSize(defaultSize)
      }
    }

    // Set initial size
    updateSize()

    // Add event listener for window resize
    window.addEventListener("resize", updateSize)

    // Clean up
    return () => window.removeEventListener("resize", updateSize)
  }, [defaultSize, mobileSize])

  return buttonSize
}
