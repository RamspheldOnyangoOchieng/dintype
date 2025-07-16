"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  Coins,
  TrendingDown,
  TrendingUp,
  MessageSquare,
  ImageIcon,
  Crown,
  ShoppingCart,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"

interface Credits {
  total_credits: number
  used_credits: number
  remaining_credits: number
}

interface Transaction {
  id: string
  credits_used: number
  transaction_type: string
  description: string
  conversation_id?: string
  character_id?: string
  created_at: string
}

export function CreditsSection() {
  const [credits, setCredits] = useState<Credits | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch credits")
      }

      const data = await response.json()
      setCredits(data.credits)
      setTransactions(data.transactions)
    } catch (error) {
      console.error("Error fetching credits:", error)
      toast({
        title: "Fel",
        description: "Kunde inte hämta kreditinformation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchCredits()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "image_generation":
        return <ImageIcon className="h-4 w-4" />
      case "premium_feature":
        return <Crown className="h-4 w-4" />
      case "purchase":
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case "bonus":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      default:
        return <Coins className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "purchase":
      case "bonus":
        return "text-green-600"
      default:
        return "text-red-600"
    }
  }

  const formatTransactionDescription = (transaction: Transaction) => {
    switch (transaction.transaction_type) {
      case "message":
        return "Chattmeddelande skickat"
      case "image_generation":
        return "Bild genererad"
      case "premium_feature":
        return "Premium-funktion använd"
      case "purchase":
        return "Krediter köpta"
      case "bonus":
        return "Bonuskrediter"
      default:
        return transaction.description || "Okänd transaktion"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const usagePercentage = credits ? (credits.used_credits / credits.total_credits) * 100 : 0
  const isLowCredits = credits && credits.remaining_credits < 10
  const isOutOfCredits = credits && credits.remaining_credits <= 0

  return (
    <div className="space-y-6">
      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`${isOutOfCredits ? "border-red-500 bg-red-50" : isLowCredits ? "border-yellow-500 bg-yellow-50" : ""}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Återstående krediter</CardTitle>
            <Coins
              className={`h-4 w-4 ${isOutOfCredits ? "text-red-500" : isLowCredits ? "text-yellow-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {credits?.remaining_credits || 0}
              {isOutOfCredits && <AlertTriangle className="inline ml-2 h-5 w-5 text-red-500" />}
            </div>
            <p className="text-xs text-muted-foreground">av {credits?.total_credits || 0} totala krediter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Använda krediter</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits?.used_credits || 0}</div>
            <Progress value={usagePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala krediter</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits?.total_credits || 0}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => (window.location.href = "/premium")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Köp fler krediter
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Low Credits Warning */}
      {isLowCredits && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  {isOutOfCredits ? "Inga krediter kvar!" : "Lågt antal krediter!"}
                </h3>
                <p className="text-sm text-yellow-700">
                  {isOutOfCredits
                    ? "Du har inga krediter kvar. Köp fler krediter för att fortsätta använda tjänsten."
                    : "Du har få krediter kvar. Överväg att köpa fler krediter snart."}
                </p>
                <Button
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => (window.location.href = "/premium")}
                >
                  Köp krediter nu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Senaste transaktioner</CardTitle>
              <CardDescription>Dina senaste kreditanvändningar och köp</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Uppdatera
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Inga transaktioner än</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.transaction_type)}</div>
                    <div>
                      <p className="font-medium">{formatTransactionDescription(transaction)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.created_at), "PPp", { locale: sv })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type === "purchase" || transaction.transaction_type === "bonus"
                        ? `+${Math.abs(transaction.credits_used)}`
                        : `-${transaction.credits_used}`}{" "}
                      krediter
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.transaction_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit Pricing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Kreditpriser</CardTitle>
          <CardDescription>Så här mycket kostar olika funktioner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Chattmeddelande</p>
                <p className="text-sm text-muted-foreground">1 kredit per meddelande</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Bildgenerering</p>
                <p className="text-sm text-muted-foreground">5 krediter per bild</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Premium-funktioner</p>
                <p className="text-sm text-muted-foreground">Varierar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
