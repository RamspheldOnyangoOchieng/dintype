"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, AlertTriangle, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Credits {
  remaining_credits: number
  total_credits: number
}

export function CreditsWidget() {
  const [credits, setCredits] = useState<Credits | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setCredits(data.credits)
        }
      } catch (error) {
        console.error("Error fetching credits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredits()

    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Laddar krediter...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!credits) return null

  const isLowCredits = credits.remaining_credits < 10
  const isOutOfCredits = credits.remaining_credits <= 0

  return (
    <Card className={`mb-4 ${isOutOfCredits ? "border-red-500" : isLowCredits ? "border-yellow-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Coins
              className={`h-4 w-4 ${isOutOfCredits ? "text-red-500" : isLowCredits ? "text-yellow-500" : "text-primary"}`}
            />
            <span className="text-sm font-medium">Krediter</span>
          </div>
          {(isLowCredits || isOutOfCredits) && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </div>

        <div className="text-lg font-bold mb-2">
          {credits.remaining_credits} / {credits.total_credits}
        </div>

        {isOutOfCredits ? (
          <div className="space-y-2">
            <p className="text-xs text-red-600">Inga krediter kvar!</p>
            <Button asChild size="sm" className="w-full bg-red-600 hover:bg-red-700">
              <Link href="/premium">
                <ShoppingCart className="mr-2 h-3 w-3" />
                Köp krediter
              </Link>
            </Button>
          </div>
        ) : isLowCredits ? (
          <div className="space-y-2">
            <p className="text-xs text-yellow-600">Lågt antal krediter!</p>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href="/premium">
                <ShoppingCart className="mr-2 h-3 w-3" />
                Köp fler
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href="/profile">Visa detaljer</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
