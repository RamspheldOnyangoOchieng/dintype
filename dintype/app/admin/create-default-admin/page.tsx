"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Key, Lock, User, Mail } from "lucide-react"

export default function CreateDefaultAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [credentials, setCredentials] = useState<{
    email: string
    password: string
    username: string
  } | null>(null)

  const createDefaultAdmin = async () => {
    setIsLoading(true)
    setError("")
    setSuccess(false)
    setCredentials(null)

    try {
      // Try the first endpoint
      let response = await fetch("/api/admin/create-default-admin", {
        method: "POST",
      })

      // If that fails, try the alternative endpoint
      if (!response.ok) {
        console.log("First endpoint failed, trying alternative...")
        response = await fetch("/api/admin/create-default-admin-alt", {
          method: "POST",
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create default admin account")
      }

      setSuccess(true)
      setCredentials(data.credentials)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] p-4">
      <Card className="w-full max-w-md bg-[#1A1A1A] border-[#333] text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Default Admin Account</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            This will create or reset the default admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-800 text-green-300 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Default admin account created successfully!</span>
            </div>
          )}

          {credentials && (
            <div className="bg-blue-900/20 border border-blue-800 text-blue-300 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-blue-200">Admin Credentials</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">Username: {credentials.username}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">Email: {credentials.email}</span>
                </div>
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  <span className="text-sm">Password: {credentials.password}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-400">
                <Lock className="h-3 w-3 inline mr-1" />
                Please save these credentials in a secure location.
              </div>
            </div>
          )}

          <div className="bg-yellow-900/20 border border-yellow-800 text-yellow-300 p-4 rounded-lg text-sm">
            <p className="font-medium mb-1">⚠️ Warning</p>
            <p>
              This will create or reset the default admin account with predefined credentials. In production, you should
              change these credentials immediately after creation.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={createDefaultAdmin}
            disabled={isLoading}
            className="w-full bg-[#FF4D8D] hover:bg-[#FF3D7D] text-white"
          >
            {isLoading ? "Creating..." : "Create Default Admin Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
