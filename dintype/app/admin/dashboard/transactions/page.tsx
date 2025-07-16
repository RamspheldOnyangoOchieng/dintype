"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { TransactionsList } from "@/components/transactions-list"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasRedirectsTable, setHasRedirectsTable] = useState(false)
  const { toast } = useToast()

  const fetchTransactions = async (showToast = false) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add a cache-busting parameter to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/payment-transactions?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`)
      }

      const data = await response.json()

      // Update state with transactions and table status
      setTransactions(data.transactions || [])
      setHasRedirectsTable(data.hasRedirectsTable || false)

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

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchTransactions()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions Dashboard</h1>
          <p className="text-muted-foreground">View and manage payment transactions</p>
        </div>
        <Button onClick={() => fetchTransactions(true)} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

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
          <TransactionsList transactions={transactions} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
