"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentAnalytics } from "@/components/payment-analytics"
import { TransactionsList } from "@/components/transactions-list"
import PaymentRedirectsList from "@/components/payment-redirects-list"

export function EnhancedTransactionsDashboard() {
  const [activeTab, setActiveTab] = useState("transactions")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transactions Dashboard</h2>
        <p className="text-muted-foreground">
          Manage and monitor all payment transactions and user payment activities.
        </p>
      </div>

      <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="redirects">Payment Redirects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionsList />
        </TabsContent>

        <TabsContent value="redirects" className="space-y-4">
          <PaymentRedirectsList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>View payment trends and statistics over time.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <PaymentAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
