"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SuccessPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Get payment intent ID from URL if available
    const url = new URL(window.location.href)
    const paymentIntentId = url.searchParams.get("payment_intent") || ""

    // Track this redirect
    const trackRedirect = async () => {
      try {
        console.log("Tracking payment redirect...", { paymentIntentId })

        const response = await fetch("/api/track-payment-redirect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            redirectPage: "/premium/success",
            paymentIntentId,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error("Track redirect error response:", data)
          throw new Error(data.error || "Failed to track redirect")
        }

        console.log("Track redirect success:", data)

        // Show success toast
        toast({
          title: "Payment successful!",
          description: "Your account has been upgraded to premium.",
          variant: "default",
        })

        setError(null)
      } catch (error) {
        console.error("Error tracking redirect:", error)
        setError(error instanceof Error ? error.message : "Unknown error tracking payment")

        toast({
          title: "Payment tracking issue",
          description: "There was an issue tracking your payment, but your payment was successful.",
          variant: "default", // Changed from destructive to not alarm the user
        })
      } finally {
        setIsTracking(false)
      }
    }

    trackRedirect()
  }, [toast, retryCount])

  const handleRetry = () => {
    setIsTracking(true)
    setError(null)
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {error ? (
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase. Your account has been upgraded to premium.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            You now have access to all premium features. Enjoy the enhanced experience!
          </p>

          {error && (
            <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                There was an issue tracking your payment status, but your payment was successful. You can continue using
                the app or retry tracking.
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry} disabled={isTracking}>
                {isTracking ? "Retrying..." : "Retry Tracking"}
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button className="flex-1" onClick={() => router.push("/chat")} disabled={isTracking}>
              Start Chatting
            </Button>
            <Button className="flex-1" variant="outline" onClick={() => router.push("/generate")} disabled={isTracking}>
              Generate Images
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
