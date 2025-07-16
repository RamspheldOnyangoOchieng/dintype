"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ConfirmEmailPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl p-8 shadow-lg border text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 font-semibold text-lg">
            Sign up Successful
          </div>
          <h1 className="text-2xl font-bold mb-4">Confirm your email</h1>
          <p className="mb-6">We have sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.</p>
          <Button className="w-full" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
} 