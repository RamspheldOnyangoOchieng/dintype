"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function RunAdminStatusMigrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const runMigration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/run-admin-status-migration")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to run migration")
      }

      toast({
        title: "Success",
        description: "Admin status migration executed successfully",
      })
    } catch (error) {
      console.error("Error running migration:", error)
      toast({
        title: "Error",
        description: "Failed to run migration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Run Admin Status Migration</h1>
      <p className="mb-4">
        This will create a function to update user admin status in the database. This is required for the admin toggle
        functionality to work properly.
      </p>
      <Button onClick={runMigration} disabled={isLoading}>
        {isLoading ? "Running Migration..." : "Run Migration"}
      </Button>
    </div>
  )
}
