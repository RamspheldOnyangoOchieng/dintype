import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import SubscriptionPlansList from "@/components/subscription-plans-list"
import { getSubscriptionPlans } from "@/lib/subscription-plans"

export const metadata = {
  title: "Prenumerationsplaner",
  description: "Hantera prenumerationsplaner för din AI-karaktärsplattform",
}

export default async function SubscriptionsPage() {
  const plans = await getSubscriptionPlans()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Prenumerationsplaner</h1>
          <p className="text-gray-600">Hantera prenumerationsplaner och prissättning för din AI-karaktärsplattform</p>
        </div>
        <Link href="/admin/dashboard/subscriptions/create">
          <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            Ny plan
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="text-gray-700">Laddar prenumerationsplaner...</div>}>
        <SubscriptionPlansList initialPlans={plans} />
      </Suspense>
    </div>
  )
}
