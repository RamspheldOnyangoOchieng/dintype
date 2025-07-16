"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "@/lib/use-translations" // Fixed: changed from useTranslation to useTranslations

interface Transaction {
  id: string
  user_id: string
  amount: number
  currency: string
  status: string
  payment_method: string
  created_at: string
  [key: string]: any
}

interface PaymentAnalyticsProps {
  transactions: Transaction[]
}

export function PaymentAnalytics({ transactions = [] }: PaymentAnalyticsProps) {
  const { t } = useTranslations() // Fixed: changed from useTranslation to useTranslations
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [averageTransaction, setAverageTransaction] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      setTotalRevenue(0)
      setSuccessRate(0)
      setAverageTransaction(0)
      setPaymentMethods({})
      return
    }

    // Calculate total revenue from completed transactions
    const completedTransactions = transactions.filter(
      (t) => t.status.toLowerCase() === "completed" || t.status.toLowerCase() === "genomförd",
    )

    const revenue = completedTransactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0)

    // Calculate success rate
    const successRate = transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0

    // Calculate average transaction amount
    const avgTransaction = completedTransactions.length > 0 ? revenue / completedTransactions.length : 0

    // Count payment methods
    const methodCounts: Record<string, number> = {}
    transactions.forEach((transaction) => {
      const method = transaction.payment_method || "Unknown"
      methodCounts[method] = (methodCounts[method] || 0) + 1
    })

    setTotalRevenue(revenue)
    setSuccessRate(successRate)
    setAverageTransaction(avgTransaction)
    setPaymentMethods(methodCounts)
  }, [transactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
    }).format(amount)
  }

  const translatePaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
        return t("Kreditkort")
      case "debit card":
        return t("Betalkort")
      case "bank transfer":
        return t("Banköverföring")
      case "paypal":
        return "PayPal"
      default:
        return method
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{t("Betalningsanalys")}</h2>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{t("Total intäkt")}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">{t("Framgångsfrekvens")}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{successRate.toFixed(1)}%</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">{t("Genomsnittlig transaktion")}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(averageTransaction)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t("Betalningsmetoder")}</h3>
          <div className="space-y-2">
            {Object.entries(paymentMethods).map(([method, count]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{translatePaymentMethod(method)}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
