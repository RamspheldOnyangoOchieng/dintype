"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts"

interface Transaction {
  id: string
  user_id: string
  amount: number
  status: string
  payment_method: string
  created_at: string
  [key: string]: any
}

interface DateRange {
  from: Date
  to: Date
}

interface PaymentTrendsChartProps {
  transactions: Transaction[]
  dateRange: DateRange
}

export function PaymentTrendsChart({ transactions, dateRange }: PaymentTrendsChartProps) {
  // Prepare data for charts
  const chartData = useMemo(() => {
    // Group transactions by day
    const dailyData = {}

    // Create a map of all dates in the range
    const dateMap = {}
    const currentDate = new Date(dateRange.from)
    while (currentDate <= dateRange.to) {
      const dateKey = currentDate.toISOString().split("T")[0]
      dateMap[dateKey] = {
        date: dateKey,
        totalAmount: 0,
        count: 0,
        cumulativeAmount: 0,
        cumulativeCount: 0,
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Fill in the data from transactions
    transactions.forEach((transaction) => {
      const date = new Date(transaction.created_at).toISOString().split("T")[0]
      if (!dateMap[date]) return // Skip if outside range

      const isSuccessful =
        transaction.status?.toLowerCase() === "completed" || transaction.status?.toLowerCase() === "succeeded"

      if (isSuccessful) {
        dateMap[date].count += 1
        dateMap[date].totalAmount += transaction.amount || 0
      }
    })

    // Calculate cumulative values
    let cumulativeAmount = 0
    let cumulativeCount = 0

    // Convert to array and sort by date
    return Object.values(dateMap)
      .sort((a: any, b: any) => a.date.localeCompare(b.date))
      .map((day: any) => {
        cumulativeAmount += day.totalAmount
        cumulativeCount += day.count

        return {
          ...day,
          date: formatDate(day.date),
          cumulativeAmount,
          cumulativeCount,
          averageValue: day.count > 0 ? day.totalAmount / day.count : 0,
        }
      })
  }, [transactions, dateRange])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("sv-SE", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Cumulative Revenue</CardTitle>
          <CardDescription>Total revenue growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Cumulative Revenue"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  name="Cumulative Revenue"
                  dataKey="cumulativeAmount"
                  stroke="#FF4D8D"
                  fill="#FF4D8D"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Average Transaction Value</CardTitle>
          <CardDescription>Daily average value of successful transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Average Value"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  name="Average Transaction Value"
                  dataKey="averageValue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
