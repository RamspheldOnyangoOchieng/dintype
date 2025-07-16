"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSubscriptionPlan, updateSubscriptionPlan } from "@/lib/subscription-plans"
import type { SubscriptionPlan } from "@/types/subscription"

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan
  isEdit?: boolean
}

export default function SubscriptionPlanForm({ plan, isEdit = false }: SubscriptionPlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>(
    plan || {
      name: "",
      duration: 1,
      original_price: 0,
      discounted_price: null,
      discount_percentage: null,
      is_popular: false,
      features: [],
      promotional_image: "",
      features_image: "",
    },
  )
  const [newFeature, setNewFeature] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value === "" ? null : Number(value) })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, is_popular: checked })
  }

  const handleDurationChange = (value: string) => {
    setFormData({ ...formData, duration: Number(value) })
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) return

    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeature.trim()],
    })
    setNewFeature("")
  }

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...(formData.features || [])]
    updatedFeatures.splice(index, 1)
    setFormData({ ...formData, features: updatedFeatures })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Plannamn krävs"
    }

    if (formData.original_price === undefined || formData.original_price === null || formData.original_price < 0) {
      newErrors.original_price = "Originalpris krävs och måste vara ett positivt tal"
    }

    if (
      formData.discounted_price !== null &&
      formData.discounted_price !== undefined &&
      (formData.discounted_price < 0 || formData.discounted_price >= (formData.original_price || 0))
    ) {
      newErrors.discounted_price = "Rabatterat pris måste vara lägre än originalpriset"
    }

    if (
      formData.discount_percentage !== null &&
      formData.discount_percentage !== undefined &&
      (formData.discount_percentage < 0 || formData.discount_percentage > 100)
    ) {
      newErrors.discount_percentage = "Rabattprocent måste vara mellan 0 och 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (isEdit && plan) {
        await updateSubscriptionPlan(plan.id, formData as SubscriptionPlan)
      } else {
        await createSubscriptionPlan(formData as SubscriptionPlan)
      }
      router.push("/admin/dashboard/subscriptions")
      router.refresh()
    } catch (error) {
      console.error("Kunde inte spara prenumerationsplan:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Grundläggande information</CardTitle>
          <CardDescription className="text-gray-600">
            Ange grundläggande detaljer för denna prenumerationsplan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Plannamn
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="t.ex. Premiumplan"
              className={errors.name ? "border-red-500" : "border-gray-300"}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-700">
              Varaktighet
            </Label>
            <Select value={String(formData.duration || 1)} onValueChange={handleDurationChange}>
              <SelectTrigger id="duration" className="w-full border-gray-300">
                <SelectValue placeholder="Välj varaktighet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Månadsvis</SelectItem>
                <SelectItem value="3">Kvartalsvis (3 månader)</SelectItem>
                <SelectItem value="6">Halvårsvis (6 månader)</SelectItem>
                <SelectItem value="12">Årsvis (12 månader)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_popular" checked={formData.is_popular || false} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_popular" className="text-gray-700">
              Markera som populär plan
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Prissättning</CardTitle>
          <CardDescription className="text-gray-600">Ange prisdetaljer för denna prenumerationsplan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original_price" className="text-gray-700">
              Originalpris
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-600">kr</span>
              <Input
                id="original_price"
                name="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price === null ? "" : formData.original_price}
                onChange={handleNumberChange}
                placeholder="0.00"
                className={`pl-7 ${errors.original_price ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            {errors.original_price && <p className="text-sm text-red-500">{errors.original_price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discounted_price" className="text-gray-700">
              Rabatterat pris (Valfritt)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-600">kr</span>
              <Input
                id="discounted_price"
                name="discounted_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.discounted_price === null ? "" : formData.discounted_price}
                onChange={handleNumberChange}
                placeholder="0.00"
                className={errors.discounted_price ? "pl-7 border-red-500" : "pl-7 border-gray-300"}
              />
            </div>
            {errors.discounted_price && <p className="text-sm text-red-500">{errors.discounted_price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_percentage" className="text-gray-700">
              Rabattprocent (Valfritt)
            </Label>
            <div className="relative">
              <Input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage === null ? "" : formData.discount_percentage}
                onChange={handleNumberChange}
                placeholder="t.ex. 20"
                className={errors.discount_percentage ? "pr-7 border-red-500" : "pr-7 border-gray-300"}
              />
              <span className="absolute right-3 top-2.5 text-gray-600">%</span>
            </div>
            {errors.discount_percentage && <p className="text-sm text-red-500">{errors.discount_percentage}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Funktioner</CardTitle>
          <CardDescription className="text-gray-600">
            Lägg till funktioner som ingår i denna prenumerationsplan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Lägg till en funktion..."
              className="flex-1 border-gray-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddFeature()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddFeature}
              variant="secondary"
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            >
              <Plus className="h-4 w-4 mr-1" /> Lägg till
            </Button>
          </div>

          <div className="space-y-2">
            {formData.features && formData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 bg-gray-100 text-gray-800 border-gray-200"
                  >
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0 text-gray-500 hover:text-gray-800"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Inga funktioner tillagda ännu</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Bilder</CardTitle>
          <CardDescription className="text-gray-600">
            Lägg till reklambilder för denna prenumerationsplan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promotional_image" className="text-gray-700">
              URL för reklambild
            </Label>
            <Input
              id="promotional_image"
              name="promotional_image"
              value={formData.promotional_image || ""}
              onChange={handleChange}
              placeholder="https://exempel.com/bild.jpg"
              className="border-gray-300"
            />
            {formData.promotional_image && (
              <div className="mt-2 relative w-full max-w-xs h-32 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={formData.promotional_image || "/placeholder.svg"}
                  alt="Förhandsgranskning av reklambild"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="features_image" className="text-gray-700">
              URL för funktionsbild
            </Label>
            <Input
              id="features_image"
              name="features_image"
              value={formData.features_image || ""}
              onChange={handleChange}
              placeholder="https://exempel.com/funktioner.jpg"
              className="border-gray-300"
            />
            {formData.features_image && (
              <div className="mt-2 relative w-full max-w-xs h-32 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={formData.features_image || "/placeholder.svg"}
                  alt="Förhandsgranskning av funktionsbild"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard/subscriptions")}
          disabled={isSubmitting}
          className="text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Avbryt
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSubmitting ? "Sparar..." : isEdit ? "Uppdatera plan" : "Skapa plan"}
        </Button>
      </div>
    </form>
  )
}
