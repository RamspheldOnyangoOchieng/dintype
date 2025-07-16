"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RefreshCw, AlertCircle, CheckCircle, UserCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentFixPage() {
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPremiumLoading, setIsPremiumLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userStatus, setUserStatus] = useState<any>(null)
  const [makePremium, setMakePremium] = useState(false)
  const { toast } = useToast()

  const checkUserStatus = async () => {
    if (!userId) {
      setError("User ID is required")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setUserStatus(null)

    try {
      // Fetch user status
      const response = await fetch(`/api/payment-debug?userId=${userId}&stripe=true`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user status: ${response.status}`)
      }

      const data = await response.json()
      setUserStatus(data)

      if (data.isPremium) {
        setSuccess(`User ${userId} is already a premium user`)
      } else {
        setSuccess(`User ${userId} is not a premium user`)
      }
    } catch (err) {
      console.error("Error checking user status:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const updatePremiumStatus = async () => {
    if (!userId) {
      setError("User ID is required")
      return
    }

    setIsPremiumLoading(true)
    setError(null)

    try {
      // Update premium status
      const response = await fetch("/api/admin/update-premium-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isPremium: makePremium,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update premium status: ${response.status}`)
      }

      const data = await response.json()

      toast({
        title: "Premium status updated",
        description: `User ${userId} premium status set to ${makePremium ? "premium" : "not premium"}`,
        duration: 5000,
      })

      // Refresh user status
      await checkUserStatus()
    } catch (err) {
      console.error("Error updating premium status:", err)
      setError(err instanceof Error ? err.message : String(err))

      toast({
        title: "Error updating premium status",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsPremiumLoading(false)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Fix Tool</h1>
          <p className="text-muted-foreground">Check and fix user premium status</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Check User Status</CardTitle>
          <CardDescription>Enter a user ID to check their premium status and payment history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">User ID</label>
              <div className="flex gap-2">
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID to check"
                />
                <Button onClick={checkUserStatus} disabled={isLoading || !userId} className="flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Check Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Status Check</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {userStatus && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Premium Status</h3>
                  <div className={`flex items-center ${userStatus.isPremium ? "text-green-600" : "text-red-600"}`}>
                    {userStatus.isPremium ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Premium User
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Not Premium
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Transaction Count</h3>
                  <p>{userStatus.transactions?.length || 0} transactions found</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Update Premium Status</CardTitle>
              <CardDescription>Manually update the premium status for this user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="makePremium"
                    checked={makePremium}
                    onCheckedChange={(checked) => setMakePremium(checked === true)}
                  />
                  <label htmlFor="makePremium" className="text-sm font-medium">
                    Make user premium
                  </label>
                </div>

                <Button
                  onClick={updatePremiumStatus}
                  disabled={isPremiumLoading}
                  className="w-full md:w-auto flex items-center gap-2"
                >
                  {isPremiumLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Update Premium Status
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
