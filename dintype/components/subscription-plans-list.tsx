"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Star, StarOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { deleteSubscriptionPlan, togglePopularStatus } from "@/lib/subscription-plans"
import { formatCurrency } from "@/lib/utils"
import type { SubscriptionPlan } from "@/types/subscription"

interface SubscriptionPlansListProps {
  initialPlans: SubscriptionPlan[]
}

export default function SubscriptionPlansList({ initialPlans }: SubscriptionPlansListProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return

    setIsDeleting(true)
    try {
      await deleteSubscriptionPlan(planToDelete.id)
      setPlans(plans.filter((plan) => plan.id !== planToDelete.id))
    } catch (error) {
      console.error("Kunde inte ta bort prenumerationsplan:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setPlanToDelete(null)
    }
  }

  const handleTogglePopular = async (plan: SubscriptionPlan) => {
    setIsUpdating(plan.id)
    try {
      const updatedPlan = await togglePopularStatus(plan.id, !plan.is_popular)
      setPlans(plans.map((p) => (p.id === plan.id ? updatedPlan : p)))
    } catch (error) {
      console.error("Kunde inte uppdatera populär status:", error)
    } finally {
      setIsUpdating(null)
    }
  }

  const getDurationText = (duration: number) => {
    if (duration === 1) return "Månadsvis"
    if (duration === 3) return "Kvartalsvis"
    if (duration === 6) return "Halvårsvis"
    if (duration === 12) return "Årsvis"
    return `${duration} månader`
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[250px] text-gray-700">Plannamn</TableHead>
            <TableHead className="text-gray-700">Varaktighet</TableHead>
            <TableHead className="text-gray-700">Pris</TableHead>
            <TableHead className="text-gray-700">Rabatt</TableHead>
            <TableHead className="text-gray-700">Populär</TableHead>
            <TableHead className="text-gray-700">Funktioner</TableHead>
            <TableHead className="text-right text-gray-700">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-600">
                Inga prenumerationsplaner hittades. Skapa din första plan.
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    {plan.promotional_image && (
                      <div className="h-8 w-8 rounded overflow-hidden">
                        <Image
                          src={plan.promotional_image || "/placeholder.svg"}
                          alt={plan.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    )}
                    {plan.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">{getDurationText(plan.duration)}</TableCell>
                <TableCell className="text-gray-700">
                  {plan.discounted_price ? (
                    <div>
                      <span className="line-through text-gray-500 mr-2">{formatCurrency(plan.original_price)}</span>
                      <span className="font-medium text-green-600">{formatCurrency(plan.discounted_price)}</span>
                    </div>
                  ) : (
                    formatCurrency(plan.original_price)
                  )}
                </TableCell>
                <TableCell>
                  {plan.discount_percentage ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      {plan.discount_percentage}% rabatt
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePopular(plan)}
                    disabled={isUpdating === plan.id}
                    className={plan.is_popular ? "text-yellow-500" : "text-gray-400"}
                  >
                    {plan.is_popular ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell>
                  {plan.features.length > 0 ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      {plan.features.length} funktioner
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/dashboard/subscriptions/preview/${plan.id}`}>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/dashboard/subscriptions/edit/${plan.id}`}>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(plan)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Är du säker?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Detta kommer permanent att ta bort prenumerationsplanen "{planToDelete?.name}". Denna åtgärd kan inte
              ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="text-gray-700 border-gray-300 hover:bg-gray-50">
              Avbryt
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Tar bort..." : "Ta bort"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
