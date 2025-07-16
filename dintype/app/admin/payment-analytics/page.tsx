"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, RefreshCw } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { PaymentMetricsCards } from "@/components/payment-metrics-cards"
import { PaymentCharts } from "@/components/payment-charts"
import { PaymentTrendsChart } from "@/components/payment-trends-chart"
import { PaymentMethodsChart } from "@/components/payment-methods-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/auth-context"

export default function PaymentAnalyticsPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  })
  const [refreshKey, setRefreshKey] = useState(0)

  // Check authentication
  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true)
      if (!user || !isAdmin) {
        router.push("/admin/login")
      }
    }
  }, [user, isAdmin, isLoading, router])

  // Fetch payment data
  useEffect(() => {
    async function fetchPaymentData() {
      if (!isAdmin) return

      setIsLoadingData(true)
      setError(null)

      try {
        const fromDate = dateRange.from.toISOString()
        const toDate = dateRange.to.toISOString()

        const response = await fetch(`/api/payment-transactions?from=${fromDate}&to=${toDate}&refresh=${refreshKey}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`)
        }

        const data = await response.json()
        setTransactions(data.transactions || [])
      } catch (err) {
        console.error("Error fetching payment data:", err)
        setError(err.message)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (authChecked && isAdmin) {
      fetchPaymentData()
    }
  }, [authChecked, isAdmin, dateRange, refreshKey])

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Handle export to CSV
  const handleExportCSV = () => {
    if (!transactions.length) return

    // Convert transactions to CSV
    const headers = ["ID", "User ID", "Amount", "Status", "Payment Method", "Created At"]
    const csvRows = [
      headers.join(","),
      ...transactions.map((t) =>
        [t.id, t.user_id, t.amount || 0, t.status || "unknown", t.payment_method || "unknown", t.created_at].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create download link and trigger download
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `payment-data-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Show loading state while checking auth
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D8D]"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Analytics</h1>
          <p className="text-gray-600 mt-2">Analyze payment trends and performance metrics</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangePicker dateRange={dateRange} onUpdate={setDateRange} />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingData}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isLoadingData || !transactions.length}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Key Metrics Cards */}
        {isLoadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <PaymentMetricsCards transactions={transactions} />
        )}

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100 border border-gray-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
              Trends
            </TabsTrigger>
            <TabsTrigger value="methods" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
              Payment Methods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {isLoadingData ? (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading chart data...</div>
                </CardContent>
              </Card>
            ) : (
              <PaymentCharts transactions={transactions} dateRange={dateRange} />
            )}
          </TabsContent>

          <TabsContent value="trends">
            {isLoadingData ? (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading chart data...</div>
                </CardContent>
              </Card>
            ) : (
              <PaymentTrendsChart transactions={transactions} dateRange={dateRange} />
            )}
          </TabsContent>

          <TabsContent value="methods">
            {isLoadingData ? (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading chart data...</div>
                </CardContent>
              </Card>
            ) : (
              <PaymentMethodsChart transactions={transactions} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
