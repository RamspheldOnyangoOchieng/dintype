"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface PaymentRedirect {
  id: string
  user_id: string
  redirect_page: string
  redirect_timestamp: string
  payment_intent_id: string | null
  payment_status: string
  is_premium: boolean
  profiles?: {
    username: string
    email: string
  }
}

export default function PaymentRedirectsList() {
  const [redirects, setRedirects] = useState<PaymentRedirect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchRedirects = async (showToast = false) => {
    setLoading(true)
    setError(null)

    try {
      // Add cache-busting parameter
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/payment-redirects?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch payment redirects")
      }

      const data = await response.json()
      setRedirects(data.redirects || [])

      if (showToast) {
        toast({
          title: "Redirects refreshed",
          description: `Found ${data.redirects?.length || 0} payment redirects`,
          duration: 3000,
        })
      }
    } catch (err) {
      console.error("Error fetching payment redirects:", err)
      setError("Failed to load payment redirects")

      if (showToast) {
        toast({
          title: "Error refreshing redirects",
          description: err.message,
          variant: "destructive",
          duration: 5000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRedirects()

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchRedirects()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const getStatusBadge = (status: string, isPremium: boolean) => {
    if (isPremium) {
      return <Badge className="bg-green-500">Premium</Badge>
    }

    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Redirects</CardTitle>
        <Button variant="outline" size="sm" onClick={() => fetchRedirects(true)} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {loading && redirects.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : redirects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No payment redirects found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Redirect Page</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redirects.map((redirect) => (
                  <TableRow key={redirect.id}>
                    <TableCell>
                      {redirect.profiles?.username || redirect.profiles?.email || redirect.user_id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{redirect.redirect_page}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(redirect.redirect_timestamp), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {redirect.payment_intent_id ? redirect.payment_intent_id.slice(0, 12) + "..." : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(redirect.payment_status, redirect.is_premium)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
