"use client"

import { useState } from "react"
// Import our custom Button component instead of the default one
import { Button } from "@/components/ui/custom-button"
import { useToast } from "@/components/ui/use-toast"

interface PaymentButtonProps {
  planId: string
  userId?: string
  email?: string
  buttonText?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

// Update the component to use our improved button styling
export function PaymentButton({
  planId,
  userId,
  email,
  buttonText = "Subscribe",
  className,
  variant = "adult", // Changed default to our new 'adult' variant
  size = "default",
  disabled = false,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        if (onSuccess) {
          onSuccess(data.url)
        } else {
          // Redirect to Stripe checkout
          window.location.href = data.url
        }
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error: any) {
      console.error("Payment error:", error.message)
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      })
      if (onError) {
        onError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || disabled}
      className={className}
      variant={variant}
      size={size}
      isLoading={isLoading}
      loadingText="Processing..."
    >
      {buttonText}
    </Button>
  )
}
