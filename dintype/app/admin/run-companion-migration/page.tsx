"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-context"
import { AdminDebug } from "@/components/admin-debug"

export default function RunCompanionMigrationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const { isAdmin } = useAuth()

  const runMigration = async () => {
    try {
      setIsRunning(true)
      setResult(null)

      const response = await fetch("/api/admin/run-companion-migration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ error: data.error || "Failed to run migration" })
        return
      }

      setResult({ success: true })
    } catch (error) {
      console.error("Error running migration:", error)
      setResult({ error: "An unexpected error occurred" })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Run Companion Experience Migration</h1>

      <AdminDebug />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Companion Experience Table Migration</CardTitle>
          <CardDescription>
            This will create the companion_experience table and set up the necessary RLS policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This migration will:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Create the companion_experience table if it doesn't exist</li>
            <li>Set up Row Level Security (RLS) policies</li>
            <li>Insert default content for the companion experience section</li>
          </ul>
          <p className="text-amber-500">
            Note: This is safe to run multiple times as it uses IF NOT EXISTS and ON CONFLICT clauses.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={runMigration} disabled={isRunning || !isAdmin}>
            {isRunning ? "Running Migration..." : "Run Migration"}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card className={result.success ? "bg-green-900/20" : "bg-red-900/20"}>
          <CardHeader>
            <CardTitle>{result.success ? "Success" : "Error"}</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? <p>Migration completed successfully!</p> : <p>Error: {result.error}</p>}
          </CardContent>
          <CardFooter>
            {result.success && (
              <Button variant="outline" onClick={() => (window.location.href = "/admin/dashboard")}>
                Go to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
