"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AdminOnlyPage from "@/components/admin-only-page"

export default function RunPaymentRedirectsMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const runMigration = async () => {
    setIsRunning(true)

    try {
      const response = await fetch("/api/admin/run-payment-redirects-migration", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to run migration")
      }

      toast({
        title: "Success",
        description: "Payment redirects migration completed successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error running migration:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run migration",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <AdminOnlyPage>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Run Payment Redirects Migration</h1>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Payment Redirects Table</CardTitle>
            <CardDescription>Create the payment_redirects table to track user redirects after payment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This will create a new table to track which page users are redirected to after payment, which will be used
              to determine premium status.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={runMigration} disabled={isRunning} className="w-full">
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Migration...
                </>
              ) : (
                "Run Migration"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminOnlyPage>
  )
}
