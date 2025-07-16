"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, CreditCard, CheckCircle, XCircle, Calendar } from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface SubscriptionSectionProps {
  isPremium?: boolean
  premiumExpiry?: string
  detailed?: boolean
}

export function SubscriptionSection({ isPremium, premiumExpiry, detailed = false }: SubscriptionSectionProps) {
  const router = useRouter()

  if (detailed) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Prenumerationsstatus</CardTitle>
            <CardDescription>Hantera din prenumeration och funktioner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${isPremium ? "bg-yellow-100" : "bg-gray-100"}`}>
                  {isPremium ? (
                    <Crown className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{isPremium ? "Premium-prenumeration" : "Gratis konto"}</h3>
                  <p className="text-muted-foreground">
                    {isPremium
                      ? "Du har tillgång till alla premium-funktioner"
                      : "Uppgradera för att få tillgång till fler funktioner"}
                  </p>
                </div>
              </div>

              {isPremium && premiumExpiry && (
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Förnyelsedatum</p>
                    <p className="text-sm text-yellow-700">{format(new Date(premiumExpiry), "PPP", { locale: sv })}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Premium-funktioner</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Obegränsade meddelanden</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>HD-bildgenerering</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Prioriterad support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Exklusiva karaktärer</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Gratis funktioner</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>100 gratis krediter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Grundläggande chat</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Standard bildkvalitet</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                {!isPremium ? (
                  <Button className="flex-1" onClick={() => router.push("/premium")}>
                    <Crown className="mr-2 h-4 w-4" />
                    Uppgradera till Premium
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => router.push("/premium")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Hantera prenumeration
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prenumeration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPremium ? (
                <Crown className="h-5 w-5 text-yellow-500" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-500" />
              )}
              <span className="font-medium">{isPremium ? "Premium" : "Gratis"}</span>
            </div>
            <Badge variant={isPremium ? "default" : "outline"}>{isPremium ? "Aktiv" : "Grundläggande"}</Badge>
          </div>

          {isPremium && premiumExpiry && (
            <p className="text-sm text-muted-foreground">
              Förnyelse: {format(new Date(premiumExpiry), "d MMM yyyy", { locale: sv })}
            </p>
          )}

          <Button
            variant={isPremium ? "outline" : "default"}
            className="w-full"
            onClick={() => router.push("/premium")}
          >
            {isPremium ? "Hantera" : "Uppgradera"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
