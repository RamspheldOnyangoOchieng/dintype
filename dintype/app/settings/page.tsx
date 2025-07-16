"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">App Settings</h2>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select className="border border-gray-300 rounded-md p-2 bg-white text-gray-800" defaultValue="system">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="notifications" className="h-4 w-4 text-primary border-gray-300 rounded" />
            <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
              Enable notifications
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Privacy Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="data-collection"
              className="h-4 w-4 text-primary border-gray-300 rounded"
              defaultChecked
            />
            <label htmlFor="data-collection" className="ml-2 text-sm text-gray-700">
              Allow data collection for personalization
            </label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="marketing" className="h-4 w-4 text-primary border-gray-300 rounded" />
            <label htmlFor="marketing" className="ml-2 text-sm text-gray-700">
              Receive marketing emails
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
