"use client"

import { useState, useEffect } from "react"
import { TransactionsList } from "./transactions-list"
import { PaymentAnalytics } from "./payment-analytics"
import { DateRangePicker } from "./date-range-picker"
import { useTranslations } from "@/lib/use-translations" // Fixed: changed from useTranslation to useTranslations

export function PaymentTransactionsDashboard({ initialTransactions = [] }) {
  const { t } = useTranslations() // Fixed: changed from useTranslation to useTranslations
  const [transactions, setTransactions] = useState(initialTransactions)
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Apply date filters when dates change
  useEffect(() => {
    if (!transactions || !Array.isArray(transactions)) {
      setFilteredTransactions([])
      return
    }

    setFilteredTransactions([...transactions])
  }, [transactions])

  const refreshTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/payment-transactions")

      if (!response.ok) {
        throw new Error(`${t("Error fetching transactions")}: ${response.status}`)
      }

      const data = await response.json()
      // Ensure we're working with an array of transactions
      const transactionsArray = Array.isArray(data)
        ? data
        : data.transactions && Array.isArray(data.transactions)
          ? data.transactions
          : []

      setTransactions(transactionsArray)
      // Filtered transactions will be updated by the useEffect
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateRangeChange = (dateRange) => {
    if (!transactions || !Array.isArray(transactions)) {
      setFilteredTransactions([])
      return
    }

    let filtered = [...transactions]

    if (dateRange.from) {
      filtered = filtered.filter((transaction) => new Date(transaction.created_at) >= dateRange.from)
    }

    if (dateRange.to) {
      filtered = filtered.filter((transaction) => new Date(transaction.created_at) <= dateRange.to)
    }

    setFilteredTransactions(filtered)
  }

  const exportToCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) return

    const headers = Object.keys(filteredTransactions[0]).join(",")
    const csvRows = filteredTransactions.map((transaction) =>
      Object.values(transaction)
        .map((value) => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
        .join(","),
    )

    const csvContent = [headers, ...csvRows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <DateRangePicker onChange={handleDateRangeChange} />
        <div className="flex gap-2">
          <button
            onClick={refreshTransactions}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? t("Laddar...") : t("Uppdatera")}
          </button>
          <button
            onClick={exportToCSV}
            disabled={!filteredTransactions || filteredTransactions.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {t("Exportera CSV")}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionsList transactions={filteredTransactions} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <PaymentAnalytics transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  )
}
