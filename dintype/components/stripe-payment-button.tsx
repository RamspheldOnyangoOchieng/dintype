"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/custom-button"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAuth } from "./auth-context"
import { getUserId } from "@/lib/user-storage"

interface StripePaymentButtonProps {
  planId: string
  userId?: string
  email?: string
  buttonText?: string
  className?: string
  variant?: "adult" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  showLogos?: boolean
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

export function StripePaymentButton({
  planId,
  userId: propUserId,
  email: propEmail,
  buttonText = "Subscribe",
  className,
  variant = "adult",
  size = "default",
  disabled = false,
  showLogos = true,
  onSuccess,
  onError,
}: StripePaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Get user ID from props, auth context, or local storage
      const effectiveUserId = propUserId || user?.id || getUserId()
      const effectiveEmail = propEmail || user?.email

      if (!effectiveUserId) {
        console.warn("No user ID available for payment")
      }

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId: effectiveUserId,
          email: effectiveEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        // Store user ID in session storage before redirecting
        if (effectiveUserId) {
          sessionStorage.setItem("checkoutUserId", effectiveUserId)
        }

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
    <div className="flex flex-col items-center">
      <Button
        onClick={handlePayment}
        disabled={isLoading || disabled}
        className={`${className} w-full`}
        variant={variant}
        size={size}
        isLoading={isLoading}
        loadingText="Processing..."
      >
        {buttonText}
      </Button>

      {showLogos && isClient && (
        <div className="flex items-center justify-center mt-2 space-x-2">
          <Image src="/visa-logo.svg" alt="Visa" width={32} height={20} />
          <Image src="/mastercard-logo.svg" alt="Mastercard" width={32} height={20} />
        </div>
      )}
    </div>
  )
}
