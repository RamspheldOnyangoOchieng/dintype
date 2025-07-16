import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-8 w-48 mb-6" />

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
