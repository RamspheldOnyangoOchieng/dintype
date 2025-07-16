"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  User,
  Calendar,
  DollarSign,
  Filter,
  Download,
  FolderSyncIcon as Sync,
} from "lucide-react"

export default function StripeSyncPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [stripePayments, setStripePayments] = useState([])
  const [selectedPayments, setSelectedPayments] = useState([])
  const [userId, setUserId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState(null)
  const [syncResults, setSyncResults] = useState(null)
  const [pagination, setPagination] = useState({
    startingAfter: null,
    endingBefore: null,
    hasMore: false,
  })
  const { toast } = useToast()

  // Fetch Stripe payments
  const fetchStripePayments = async (direction = null) => {
    setIsLoading(true)
    setError(null)
    setSyncResults(null)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (userId) params.append("userId", userId)
      if (direction === "next" && pagination.startingAfter) {
        params.append("startingAfter", pagination.startingAfter)
      } else if (direction === "prev" && pagination.endingBefore) {
        params.append("endingBefore", pagination.endingBefore)
      }

      const response = await fetch(`/api/stripe-sync?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch Stripe payments: ${response.status}`)
      }

      const data = await response.json()

      setStripePayments(data.paymentIntents || [])
      setPagination({
        startingAfter: data.pagination?.starting_after || null,
        endingBefore: data.pagination?.ending_before || null,
        hasMore: data.has_more || false,
      })

      // Reset selected payments
      setSelectedPayments([])
    } catch (err) {
      console.error("Error fetching Stripe payments:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sync selected payments
  const syncSelectedPayments = async () => {
    if (selectedPayments.length === 0) {
      toast({
        title: "No payments selected",
        description: "Please select at least one payment to sync",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    setError(null)
    setSyncResults(null)

    try {
      const response = await fetch("/api/stripe-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentIds: selectedPayments,
          userId: userId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to sync payments: ${response.status}`)
      }

      const data = await response.json()
      setSyncResults(data.results || [])

      // Count successes
      const successCount = data.results.filter((r) => r.status === "success").length

      toast({
        title: successCount > 0 ? "Sync successful" : "Sync completed",
        description: `${successCount} payment(s) synced successfully`,
        variant: successCount > 0 ? "default" : "destructive",
      })

      // Refresh the list after syncing
      fetchStripePayments()
    } catch (err) {
      console.error("Error syncing payments:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Handle payment selection
  const togglePaymentSelection = (paymentId) => {
    setSelectedPayments((prev) => {
      if (prev.includes(paymentId)) {
        return prev.filter((id) => id !== paymentId)
      } else {
        return [...prev, paymentId]
      }
    })
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedPayments.length === stripePayments.length) {
      setSelectedPayments([])
    } else {
      setSelectedPayments(stripePayments.map((payment) => payment.id))
    }
  }

  // Filter payments by search query
  const filteredPayments = stripePayments.filter((payment) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    const matchesId = payment.id.toLowerCase().includes(query)
    const matchesEmail = payment.checkout_session?.customer_email?.toLowerCase().includes(query)
    const matchesAmount = payment.amount.toString().includes(query)

    return matchesId || matchesEmail || matchesAmount
  })

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Export selected payments as CSV
  const exportSelectedAsCSV = () => {
    if (selectedPayments.length === 0) {
      toast({
        title: "No payments selected",
        description: "Please select at least one payment to export",
        variant: "destructive",
      })
      return
    }

    // Filter selected payments
    const paymentsToExport = stripePayments.filter((payment) => selectedPayments.includes(payment.id))

    // Create CSV content
    const headers = ["ID", "Amount", "Currency", "Status", "Created", "Customer Email", "Description"]
    const csvContent = [
      headers.join(","),
      ...paymentsToExport.map((payment) =>
        [
          `"${payment.id}"`,
          payment.amount / 100,
          payment.currency.toUpperCase(),
          payment.status,
          formatDate(payment.created),
          `"${payment.checkout_session?.customer_email || ""}"`,
          `"${payment.description || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `stripe-payments-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: `${paymentsToExport.length} payment(s) exported to CSV`,
    })
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Stripe Payment Sync</h1>
          <p className="text-muted-foreground">Sync payments from Stripe to your database</p>
        </div>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Stripe Payments</TabsTrigger>
          <TabsTrigger value="results">Sync Results</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fetch Payments from Stripe</CardTitle>
              <CardDescription>View recent payments from Stripe and sync them to your database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Filter by User ID (Optional)</label>
                  <div className="flex gap-2">
                    <Input
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter user ID to filter"
                    />
                    <Button
                      onClick={() => fetchStripePayments()}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Fetch Payments
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {stripePayments.length > 0 && (
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedPayments.length === stripePayments.length && stripePayments.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm cursor-pointer">
                      Select All ({stripePayments.length})
                    </label>
                    {selectedPayments.length > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {selectedPayments.length} selected
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search payments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 w-full"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportSelectedAsCSV}
                      disabled={selectedPayments.length === 0}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 border border-red-200 rounded-md bg-red-50 text-red-800 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Error fetching payments</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : stripePayments.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-500 mb-1">No payments found</h3>
                  <p className="text-sm text-gray-400 mb-4">Fetch payments from Stripe to get started</p>
                  <Button onClick={() => fetchStripePayments()} variant="outline">
                    Fetch Payments
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedPayments.includes(payment.id) ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedPayments.includes(payment.id)}
                          onCheckedChange={() => togglePaymentSelection(payment.id)}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{payment.id.substring(0, 14)}...</span>
                              <Badge
                                variant={
                                  payment.status === "succeeded"
                                    ? "success"
                                    : payment.status === "processing"
                                      ? "warning"
                                      : payment.status === "canceled"
                                        ? "destructive"
                                        : "outline"
                                }
                                className={`text-xs ${
                                  payment.status === "succeeded"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : payment.status === "processing"
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      : payment.status === "canceled"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {payment.status}
                              </Badge>
                            </div>

                            <div className="font-medium">{formatCurrency(payment.amount, payment.currency)}</div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(payment.created)}</span>
                            </div>

                            {payment.checkout_session?.customer_email && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <User className="h-3.5 w-3.5" />
                                <span>{payment.checkout_session.customer_email}</span>
                              </div>
                            )}

                            {payment.metadata?.userId && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <User className="h-3.5 w-3.5" />
                                <span className="font-mono">User: {payment.metadata.userId.substring(0, 8)}...</span>
                              </div>
                            )}

                            {payment.description && (
                              <div className="flex items-center gap-2 text-gray-500 sm:col-span-2">
                                <span>{payment.description}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {stripePayments.length > 0 && (
              <CardFooter className="flex justify-between border-t p-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchStripePayments("prev")}
                    disabled={!pagination.endingBefore || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchStripePayments("next")}
                    disabled={!pagination.hasMore || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <Button
                  onClick={syncSelectedPayments}
                  disabled={selectedPayments.length === 0 || isSyncing}
                  className="flex items-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Sync className="h-4 w-4" />
                      Sync Selected ({selectedPayments.length})
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Sync Results</CardTitle>
              <CardDescription>View the results of your most recent sync operation</CardDescription>
            </CardHeader>
            <CardContent>
              {syncResults ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {syncResults.filter((r) => r.status === "success").length} Successful
                    </Badge>
                    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {syncResults.filter((r) => r.status === "skipped").length} Skipped
                    </Badge>
                    <Badge className="bg-red-50 text-red-700 border-red-200">
                      {syncResults.filter((r) => r.status === "error").length} Failed
                    </Badge>
                  </div>

                  {syncResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-4 border rounded-lg ${
                        result.status === "success"
                          ? "border-green-200 bg-green-50"
                          : result.status === "skipped"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : result.status === "skipped" ? (
                          <Filter className="h-5 w-5 text-yellow-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                            <div className="font-medium">
                              {result.status === "success"
                                ? "Payment synced successfully"
                                : result.status === "skipped"
                                  ? "Payment skipped"
                                  : "Sync failed"}
                            </div>

                            <div className="font-mono text-sm">{result.id.substring(0, 14)}...</div>
                          </div>

                          <p className="text-sm">{result.message}</p>

                          {result.details && (
                            <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: result.details.currency.toUpperCase(),
                                  }).format(result.details.amount)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(result.details.date).toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Sync className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-500 mb-1">No sync results yet</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Sync payments from the Stripe Payments tab to see results here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
