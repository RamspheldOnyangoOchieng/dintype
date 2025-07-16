"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function RunSeoMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/run-seo-migration")
      const data = await response.json()

      if (data.success) {
        setResult("Migration completed successfully!")
        toast({
          title: "Success",
          description: "SEO table migration completed successfully",
        })
      } else {
        setResult(`Migration failed: ${data.error}`)
        toast({
          title: "Error",
          description: data.error || "Failed to run SEO migration",
          variant: "destructive",
        })
      }
    } catch (error) {
      setResult(`Migration failed: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Run SEO Migration</CardTitle>
          <CardDescription>
            This will create the SEO settings table in your Supabase database and set up the necessary policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This migration will:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>
              Create a <code>seo_settings</code> table
            </li>
            <li>Insert default global and page SEO settings</li>
            <li>Set up Row Level Security policies</li>
          </ul>
          <p className="text-amber-500 dark:text-amber-400">
            Make sure you have admin privileges before running this migration.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={runMigration} disabled={isRunning}>
            {isRunning ? "Running Migration..." : "Run Migration"}
          </Button>
          {result && (
            <div
              className={`p-4 rounded-md ${result.includes("failed") ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300" : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"}`}
            >
              {result}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
