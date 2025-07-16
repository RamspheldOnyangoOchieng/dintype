"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DirectSqlUpdate() {
  const [sqlQuery, setSqlQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) {
      setError("SQL query cannot be empty")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Execute the SQL query
      const response = await fetch("/api/admin/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sqlQuery }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute SQL query")
      }

      setResult(data)

      // Force reload after successful update
      if (sqlQuery.toLowerCase().includes("update") && !sqlQuery.toLowerCase().includes("select")) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Direct SQL Update</CardTitle>
        <CardDescription>Execute SQL queries directly against the database (admin only)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sql-query">SQL Query</Label>
          <Textarea
            id="sql-query"
            rows={5}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="UPDATE seo_settings SET site_name = 'New Site Name' WHERE id = 'your-id-here'"
            className="font-mono"
          />
          <p className="text-sm text-muted-foreground">
            Be careful with direct SQL updates. Always include a WHERE clause when updating records.
          </p>
        </div>

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            <p className="font-semibold">Result:</p>
            <pre className="overflow-auto max-h-40 text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleExecuteSql} disabled={isLoading || !sqlQuery.trim()}>
          {isLoading ? "Executing..." : "Execute SQL"}
        </Button>
      </CardFooter>
    </Card>
  )
}
