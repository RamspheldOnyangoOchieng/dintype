"use client"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AdminStatusDebug() {
  const { user, isAdmin, isLoading } = useAuth()
  const [showDebug, setShowDebug] = useState(false)

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(!showDebug)}
        className="bg-gray-100 hover:bg-gray-200"
      >
        Debug
      </Button>

      {showDebug && (
        <div className="mt-2 p-4 bg-white border rounded-md shadow-lg w-80">
          <h3 className="font-bold mb-2">Auth Debug Info</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">User ID:</span> {user?.id || "None"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email || "None"}
            </p>
            <p>
              <span className="font-semibold">Is Admin:</span> {isAdmin ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-semibold">Loading:</span> {isLoading ? "Yes" : "No"}
            </p>
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                // Force refresh admin status
                window.location.href = "/admin"
              }}
            >
              Go to Admin
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
