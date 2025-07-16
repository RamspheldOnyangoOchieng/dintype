"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, CreditCard, Users, DollarSign } from "lucide-react"

interface Transaction {
  id: string
  user_id: string
  amount: number
  status: string
  payment_method: string
  created_at: string
  [key: string]: any
}

interface PaymentMetricsCardsProps {
  transactions: Transaction[]
}

export function PaymentMetricsCards({ transactions }: PaymentMetricsCardsProps) {
  const metrics = useMemo(() => {
    // Filter completed transactions
    const completedTransactions = transactions.filter(
      (t) => t.status?.toLowerCase() === "completed" || t.status?.toLowerCase() === "succeeded",
    )

    // Calculate total revenue
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

    // Calculate success rate
    const successRate = transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0

    // Count unique users
    const uniqueUsers = new Set(transactions.map((t) => t.user_id)).size

    // Calculate average transaction value
    const avgTransactionValue = completedTransactions.length > 0 ? totalRevenue / completedTransactions.length : 0

    // Get most recent transaction date
    const mostRecentDate =
      transactions.length > 0 ? new Date(Math.max(...transactions.map((t) => new Date(t.created_at).getTime()))) : null

    return {
      totalRevenue,
      successRate,
      uniqueUsers,
      avgTransactionValue,
      transactionCount: transactions.length,
      completedCount: completedTransactions.length,
      mostRecentDate,
    }
  }, [transactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-[#FF4D8D]" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</div>
          <p className="text-xs text-gray-500 mt-1">From {metrics.completedCount} completed payments</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            {metrics.successRate >= 50 ? (
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
            )}
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{metrics.successRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.completedCount} of {metrics.transactionCount} transactions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            <Users className="h-4 w-4 mr-1 text-[#FF4D8D]" />
            Unique Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{metrics.uniqueUsers}</div>
          <p className="text-xs text-gray-500 mt-1">
            With {(metrics.transactionCount / Math.max(1, metrics.uniqueUsers)).toFixed(1)} transactions per user
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            <CreditCard className="h-4 w-4 mr-1 text-[#FF4D8D]" />
            Avg. Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgTransactionValue)}</div>
          <p className="text-xs text-gray-500 mt-1">Last transaction: {formatDate(metrics.mostRecentDate)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
