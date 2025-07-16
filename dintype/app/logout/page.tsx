"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { forceLogout } from "@/lib/force-logout"
import { useToast } from "@/components/ui/use-toast"
import { LogOut } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Execute logout process
    const performLogout = async () => {
      try {
        console.log("Logout page: Starting logout process")

        // Show toast notification
        toast({
          title: "Logging out...",
          description: "Please wait while we securely log you out.",
          duration: 3000,
        })

        // Call server-side logout endpoint
        try {
          const response = await fetch("/api/auth/force-logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
          const data = await response.json()
          console.log("Server-side logout response:", data)
        } catch (e) {
          console.error("Server-side logout error:", e)
        }

        // Use our force logout utility
        await forceLogout()

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              // Redirect to home page after countdown
              router.push("/")
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error) {
        console.error("Error during logout page process:", error)

        // Show error toast
        toast({
          title: "Logout error",
          description: "There was a problem logging you out. Redirecting to home page.",
          variant: "destructive",
          duration: 3000,
        })

        // Force logout anyway and redirect
        setTimeout(() => {
          forceLogout()
          router.push("/")
        }, 2000)
      }
    }

    performLogout()
  }, [router, toast])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="text-center p-8 rounded-lg shadow-lg bg-card border max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <LogOut className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Logging Out</h1>

        <p className="mb-6 text-muted-foreground">
          You are being securely logged out of your account. All your session data is being cleared.
        </p>

        <div className="relative pt-1 mb-6">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
            <div
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
            ></div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Redirecting to home page in {countdown} seconds...</p>
      </div>
    </div>
  )
}
