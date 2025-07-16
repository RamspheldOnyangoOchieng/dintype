"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

interface PaymentMethodsChartProps {
  transactions: Transaction[]
}

export function PaymentMethodsChart({ transactions }: PaymentMethodsChartProps) {
  // Prepare data for charts
  const { pieData, barData } = useMemo(() => {
    // Count payment methods
    const methodCounts = {}
    const methodAmounts = {}
    const methodSuccess = {}

    transactions.forEach((transaction) => {
      const method = transaction.payment_method || "Unknown"

      // Initialize if not exists
      if (!methodCounts[method]) {
        methodCounts[method] = 0
        methodAmounts[method] = 0
        methodSuccess[method] = { success: 0, total: 0 }
      }

      methodCounts[method] += 1
      methodSuccess[method].total += 1

      const isSuccessful =
        transaction.status?.toLowerCase() === "completed" || transaction.status?.toLowerCase() === "succeeded"

      if (isSuccessful) {
        methodAmounts[method] += transaction.amount || 0
        methodSuccess[method].success += 1
      }
    })

    // Convert to array format for charts
    const pieData = Object.entries(methodCounts).map(([name, count]) => ({
      name,
      value: count,
    }))

    const barData = Object.entries(methodSuccess).map(([name, counts]) => ({
      name,
      successRate: counts.total > 0 ? (counts.success / counts.total) * 100 : 0,
      amount: methodAmounts[name],
    }))

    return { pieData, barData }
  }, [transactions])

  const COLORS = ["#FF4D8D", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2"]

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Payment Method Distribution</CardTitle>
            <CardDescription>Transaction count by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Payment Method Success Rate</CardTitle>
            <CardDescription>Success rate percentage by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Success Rate"]} />
                  <Legend />
                  <Bar dataKey="successRate" name="Success Rate" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue by Payment Method</CardTitle>
          <CardDescription>Total successful revenue by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                <Legend />
                <Bar dataKey="amount" name="Revenue" fill="#FF4D8D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
