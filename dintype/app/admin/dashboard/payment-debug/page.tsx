"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RefreshCw, AlertCircle, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { TransactionsList } from "@/components/transactions-list"

export default function PaymentDebugPage() {
  const [transactions, setTransactions] = useState([])
  const [redirects, setRedirects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState("")
  const [days, setDays] = useState(30)
  const [includeStripe, setIncludeStripe] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const { toast } = useToast()

  const fetchTransactions = async (showToast = false) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add a cache-busting parameter to prevent caching
      const timestamp = new Date().getTime()
      const queryParams = new URLSearchParams({
        t: timestamp.toString(),
        days: days.toString(),
        stripe: includeStripe.toString(),
      })

      if (userId) {
        queryParams.append("userId", userId)
      }

      const response = await fetch(`/api/payment-debug?${queryParams.toString()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch transactions: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      // Update state with transactions and other data
      setTransactions(data.transactions || [])
      setRedirects(data.redirects || [])
      setIsPremium(data.isPremium || false)

      if (!userId && data.userId) {
        setUserId(data.userId)
      }

      if (showToast) {
        toast({
          title: "Transactions refreshed",
          description: `Found ${data.transactions?.length || 0} transactions`,
          duration: 3000,
        })
      }
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err.message)

      if (showToast) {
        toast({
          title: "Error refreshing transactions",
          description: err.message,
          variant: "destructive",
          duration: 5000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch transactions on initial load
  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Debug Dashboard</h1>
          <p className="text-muted-foreground">Troubleshoot payment transactions</p>
        </div>
        <Button onClick={() => fetchTransactions(true)} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">User ID</label>
              <div className="flex gap-2">
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID to search"
                />
                <Button onClick={() => fetchTransactions(true)} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1">Days</label>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(Number.parseInt(e.target.value) || 30)}
                min="1"
                max="365"
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeStripe"
                  checked={includeStripe}
                  onCheckedChange={(checked) => setIncludeStripe(checked === true)}
                />
                <label htmlFor="includeStripe" className="text-sm font-medium">
                  Include Stripe data
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium">Premium Status:</span>
              <span className={isPremium ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                {isPremium ? "Premium User" : "Not Premium"}
              </span>
            </div>
            <div>
              <span className="font-medium">User ID:</span>
              <span className="font-mono text-xs ml-2">{userId || "Not logged in"}</span>
            </div>
            <div>
              <span className="font-medium">Redirects:</span>
              <span className="ml-2">{redirects.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error loading transactions</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={() => fetchTransactions(true)} className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : transactions.length > 0 ? (
            <TransactionsList transactions={transactions} isLoading={isLoading} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No transactions found for this user.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria or check another user ID.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
