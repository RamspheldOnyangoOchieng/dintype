import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your notifications",
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-center text-gray-500 py-8">
          <p className="mb-2">You don't have any notifications yet.</p>
          <p>Notifications about your account and activity will appear here.</p>
        </div>
      </div>
    </div>
  )
}
