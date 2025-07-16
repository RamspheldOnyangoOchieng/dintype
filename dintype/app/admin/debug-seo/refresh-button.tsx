"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { forceSeoRefresh } from "@/lib/refresh-seo"

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      setResult(null)

      const refreshResult = await forceSeoRefresh()
      setResult(refreshResult)

      if (refreshResult.success) {
        // Force page reload after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div>
      <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="mb-4">
        {isRefreshing ? "Refreshing..." : "Force SEO Refresh"}
      </Button>

      {result && (
        <div
          className={`p-2 text-sm rounded-md mb-4 ${
            result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {result.success ? result.message : result.error}
        </div>
      )}
    </div>
  )
}
