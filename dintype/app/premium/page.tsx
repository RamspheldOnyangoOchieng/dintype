"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Shield, Lock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"
import type { SubscriptionPlan } from "@/types/subscription"

// Add translation import
import { useTranslations } from "@/lib/use-translations"

export default function PremiumPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { t } = useTranslations()
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const statusCheckRef = useRef<boolean>(false)

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true)
        const response = await fetch("/api/subscription-plans")

        if (!response.ok) {
          throw new Error("Failed to fetch subscription plans")
        }

        const data = await response.json()
        setPlans(data)

        // Select the most popular plan by default, or the first plan
        const popularPlan = data.find((plan: SubscriptionPlan) => plan.is_popular)
        setSelectedPlanId(popularPlan ? popularPlan.id : data[0]?.id || null)
      } catch (error) {
        console.error("Error fetching subscription plans:", error)
        toast.error("Failed to load subscription plans. Please try again later.")
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchPlans()
  }, [])

  // Update the useEffect for checking premium status to be more efficient
  useEffect(() => {
    // Check premium status using the auth context
    const checkPremiumStatus = async () => {
      // Prevent multiple simultaneous checks
      if (statusCheckRef.current) return
      statusCheckRef.current = true

      try {
        setIsCheckingStatus(true)
        setStatusError(null)

        // Get user ID from auth context if available
        const userId = user?.id || localStorage.getItem("userId") || sessionStorage.getItem("userId")

        if (!userId) {
          console.log("No user ID available for premium check")
          setIsPremium(false)
          setIsCheckingStatus(false)
          statusCheckRef.current = false
          return
        }

        // Simple direct check without multiple retries
        try {
          // Add a cache-busting parameter and user ID
          const timestamp = new Date().getTime()
          const response = await fetch(`/api/check-premium-status?t=${timestamp}&userId=${userId}`, {
            credentials: "include", // Include credentials anyway
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("Premium status error response:", data)
            // Don't set an error, just log it and continue
            setIsPremium(false)
          } else {
            console.log("Premium status response:", data)
            setIsPremium(!!data.isPremium)
          }
        } catch (error) {
          console.error("Error checking premium status:", error)
          // Don't set an error, just log it and continue
          setIsPremium(false)
        }
      } finally {
        setIsCheckingStatus(false)
        statusCheckRef.current = false
      }
    }

    // Don't wait for auth loading to complete
    checkPremiumStatus()
  }, [user])

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      // Get user ID from wherever we can
      const userId = user?.id || localStorage.getItem("userId") || sessionStorage.getItem("userId")

      if (!userId) {
        toast.error("No user ID available")
        return
      }

      // Clear any previous errors
      setStatusError(null)

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check premium status again
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/check-premium-status?t=${timestamp}&userId=${userId}`, {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Premium status refresh error:", data)
        toast.error("Failed to refresh premium status")
      } else {
        setIsPremium(!!data.isPremium)
        toast.success("Premium status refreshed")
      }
    } catch (error) {
      console.error("Error refreshing status:", error)
      toast.error("Failed to refresh status")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Simplify the handlePayment function
  const handlePayment = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a subscription plan")
      return
    }

    try {
      setIsLoading(true)

      // Get the selected plan
      const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)
      if (!selectedPlan) {
        throw new Error("Selected plan not found")
      }

      // Get user ID from wherever we can
      const userId = user?.id || localStorage.getItem("userId") || sessionStorage.getItem("userId")
      const userEmail = user?.email || localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail")

      // Create checkout session - use user from auth context or local storage
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlanId,
          userId: userId,
          email: userEmail,
          successUrl: `${window.location.origin}/premium/success`,
          cancelUrl: `${window.location.origin}/premium?canceled=true`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to process payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(price)
  }

  // Helper function to get duration text
  const getDurationText = (duration: number) => {
    if (duration === 1) return t("premium.month")
    if (duration === 3) return `3 ${t("premium.months")}`
    if (duration === 6) return `6 ${t("premium.months")}`
    if (duration === 12) return t("premium.year")
    return `${duration} ${t("premium.months")}`
  }

  if (isCheckingStatus || isLoadingPlans) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // If there was an error checking status
  if (statusError) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-muted-foreground">There was an error checking your premium status</p>
            <p className="text-xs text-destructive mt-2">{statusError}</p>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>User email: {user?.email || "Not available"}</p>
              <p>User ID: {user?.id || localStorage.getItem("userId") || "Not available"}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button className="flex-1" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button className="flex-1" onClick={handleRefreshStatus} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Status"
              )}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // If no plans are available
  if (plans.length === 0) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">No Plans Available</h1>
            <p className="text-muted-foreground">There are currently no subscription plans available.</p>
          </div>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("premium.chooseYourPlan")}</h1>
        <p className="text-muted-foreground">{t("premium.anonymousDisclaimer")}</p>

        {/* Debug info - only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-left inline-block">
            <p>User: {user?.email || "Not available"}</p>
            <p>User ID: {user?.id || localStorage.getItem("userId") || "Not available"}</p>
            <p>Premium: {isPremium ? "Yes" : "No"}</p>
            <button
              onClick={handleRefreshStatus}
              className="mt-1 px-2 py-1 bg-gray-200 rounded text-xs"
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Status"}
            </button>
          </div>
        )}
      </div>

      <Card className="p-8 relative overflow-hidden">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Left side - Promo and image */}
          <div className="md:col-span-3">
            <div className="mb-8">
              <h2 className="text-primary text-2xl font-bold">{t("premium.springSale")}</h2>
              <h3 className="text-3xl font-bold mb-2">{t("premium.forNewUsers")}</h3>
              <p className="text-sm">
                {t("premium.discountEnds")}{" "}
                <span className="text-destructive font-semibold">{t("premium.dontMissOut")}</span>
              </p>
            </div>

            <div className="hidden md:block">
              {plans.find((plan) => plan.id === selectedPlanId)?.promotional_image ? (
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                  <Image
                    src={plans.find((plan) => plan.id === selectedPlanId)?.promotional_image || "/placeholder.svg"}
                    alt="Promotional Image"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <img src="/placeholder.svg?height=500&width=300" alt="AI Character" className="rounded-lg" />
              )}
            </div>
          </div>

          {/* Middle - Pricing options */}
          <div className="md:col-span-5 space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlanId === plan.id
                    ? "bg-gradient-to-r from-[#1c79ab] to-[#00ccff] text-white shadow-lg border-0 transform scale-[1.02]"
                    : "bg-card hover:bg-primary/5 border border-border hover:border-[#1c79ab]/50"
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-xl">{plan.name}</div>
                  {plan.discount_percentage && plan.discount_percentage > 0 && (
                    <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {plan.discount_percentage}% OFF
                    </div>
                  )}
                  {plan.is_popular && !plan.discount_percentage && (
                    <div className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">POPULAR</div>
                  )}
                </div>
                <div className={`text-sm ${selectedPlanId === plan.id ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.original_price !== plan.discounted_price && plan.discounted_price !== null && (
                    <>
                      {t("premium.was")} {formatPrice(plan.original_price)}/{getDurationText(plan.duration)}
                    </>
                  )}
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.discounted_price || plan.original_price).split(".")[0]}
                  </span>
                  <span className="text-xl font-bold">
                    {formatPrice(plan.discounted_price || plan.original_price).split(".")[1]
                      ? `.${formatPrice(plan.discounted_price || plan.original_price).split(".")[1]}`
                      : ".00"}
                  </span>
                  <span
                    className={`text-sm ml-1 ${selectedPlanId === plan.id ? "text-white/80" : "text-muted-foreground"}`}
                  >
                    /{getDurationText(plan.duration)}
                  </span>
                </div>
                {selectedPlanId === plan.id && (
                  <div className="mt-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center mr-2">
                      <div className="w-2 h-2 rounded-full bg-[#00ccff]"></div>
                    </div>
                    <span className="text-sm font-medium">{t("premium.selectedPlan")}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Additional info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                {t("premium.noAdultTransaction")}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                {t("premium.noHiddenFees")}
              </div>
            </div>

            {/* Payment button */}
            <Button
              className="w-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-2 h-12 mt-6"
              onClick={handlePayment}
              disabled={isLoading || isPremium || !selectedPlanId}
            >
              {isLoading ? t("premium.processing") : isPremium ? t("premium.alreadyPremium") : t("premium.payWithCard")}
              {!isLoading && !isPremium && (
                <span className="flex items-center gap-1">
                  <img src="/visa-logo.svg" alt="Visa" className="h-5" />
                  <img src="/mastercard-logo.svg" alt="Mastercard" className="h-5" />
                </span>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-2">
              {selectedPlanId && (
                <>
                  {plans.find((plan) => plan.id === selectedPlanId)?.duration === 1
                    ? t("premium.monthlyPayment")
                    : t("premium.oneTimePayment")}{" "}
                  {formatPrice(
                    plans.find((plan) => plan.id === selectedPlanId)?.discounted_price ||
                      plans.find((plan) => plan.id === selectedPlanId)?.original_price ||
                      0,
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side - Benefits and image */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold mb-4">{t("premium.benefits")}</h3>
            {selectedPlanId && plans.find((plan) => plan.id === selectedPlanId)?.features && (
              <ul className="space-y-3 mb-8">
                {plans
                  .find((plan) => plan.id === selectedPlanId)
                  ?.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
              </ul>
            )}

            <div className="hidden md:block mt-8">
              {plans.find((plan) => plan.id === selectedPlanId)?.features_image ? (
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                  <Image
                    src={plans.find((plan) => plan.id === selectedPlanId)?.features_image || "/placeholder.svg"}
                    alt="Features Image"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <img src="/placeholder.svg?height=500&width=300" alt="AI Character" className="rounded-lg" />
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Security badges */}
      <div className="flex justify-center mt-8 space-x-8">
        <div className="flex items-center text-muted-foreground">
          <Shield className="h-5 w-5 mr-2" />
          <span>{t("premium.antivirusSecured")}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Lock className="h-5 w-5 mr-2" />
          <span>{t("premium.privacyInStatement")}</span>
        </div>
      </div>
    </div>
  )
}
