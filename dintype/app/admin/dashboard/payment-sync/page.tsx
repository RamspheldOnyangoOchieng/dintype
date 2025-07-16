"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentSyncPage() {
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [syncResult, setSyncResult] = useState<any>(null)
  const { toast } = useToast()

  const handleSync = async () => {
    if (!userId) {
      setError("User ID is required")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setSyncResult(null)

    try {
      const response = await fetch("/api/payment-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync payments")
      }

      setSyncResult(data)
      setSuccess(`Successfully synced ${data.syncedTransactions} transactions`)

      toast({
        title: "Payment sync successful",
        description: `Synced ${data.syncedTransactions} transactions for user ${userId}`,
        duration: 5000,
      })
    } catch (err) {
      console.error("Error syncing payments:", err)
      setError(err instanceof Error ? err.message : String(err))

      toast({
        title: "Error syncing payments",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Sync Tool</h1>
          <p className="text-muted-foreground">Sync missing payments from Stripe to your database</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sync User Payments</CardTitle>
          <CardDescription>
            Enter a user ID to sync their payment history from Stripe to your database. This will find any successful
            payments in Stripe that aren't recorded in your database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">User ID</label>
              <div className="flex gap-2">
                <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user ID to sync" />
                <Button onClick={handleSync} disabled={isLoading || !userId} className="flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Sync Payments
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
              <h3 className="font-medium text-red-800">Error syncing payments</h3>
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
              <h3 className="font-medium text-green-800">Sync successful</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {syncResult && syncResult.newTransactions && syncResult.newTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Synced Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Transaction ID</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {syncResult.newTransactions.map((tx: any) => (
                    <tr key={tx.id} className="border-b">
                      <td className="py-2 px-4 font-mono text-xs">{tx.id}</td>
                      <td className="py-2 px-4">
                        {new Intl.NumberFormat("sv-SE", {
                          style: "currency",
                          currency: tx.currency || "SEK",
                        }).format(tx.amount)}
                      </td>
                      <td className="py-2 px-4">{new Date(tx.created_at).toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
