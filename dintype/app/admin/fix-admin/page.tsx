"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function FixAdminPage() {
  const { user, isAdmin, refreshSession } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (isAdmin) {
      setMessage("You already have admin privileges.")
    }
  }, [isAdmin])

  const fixAdminStatus = async () => {
    if (!user) {
      setError("You must be logged in to fix admin status.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("Checking and fixing admin status...")

    try {
      const response = await fetch("/api/admin/check-fix-admin")
      const data = await response.json()

      if (data.success) {
        setMessage("Admin status fixed successfully! Refreshing session...")

        // Refresh the session to update the admin status
        await refreshSession()

        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/admin")
        }, 2000)
      } else {
        setError(`Failed to fix admin status: ${data.message}`)
      }
    } catch (err) {
      setError("An error occurred while fixing admin status.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Fix Admin Status</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold mb-2">Current Status:</h2>
            <p>User ID: {user?.id || "Not logged in"}</p>
            <p>Email: {user?.email || "Not available"}</p>
            <p>Admin: {isAdmin ? "Yes" : "No"}</p>
          </div>

          {message && <div className="p-3 bg-green-100 text-green-800 rounded-md">{message}</div>}

          {error && <div className="p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}

          <div className="flex flex-col space-y-3">
            <Button onClick={fixAdminStatus} disabled={loading || !user} className="w-full">
              {loading ? "Processing..." : "Fix Admin Status"}
            </Button>

            <Button variant="outline" onClick={() => router.push("/admin")} className="w-full">
              Go to Admin Dashboard
            </Button>

            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
