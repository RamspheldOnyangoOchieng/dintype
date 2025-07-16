"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, ImageIcon, Crown, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Starta ny chatt",
      description: "Börja en konversation med en AI-karaktär",
      icon: <MessageSquare className="h-5 w-5" />,
      onClick: () => router.push("/chat"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Generera bild",
      description: "Skapa en ny AI-genererad bild",
      icon: <ImageIcon className="h-5 w-5" />,
      onClick: () => router.push("/generate"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Uppgradera till Premium",
      description: "Få tillgång till fler funktioner",
      icon: <Crown className="h-5 w-5" />,
      onClick: () => router.push("/premium"),
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      title: "Inställningar",
      description: "Hantera ditt konto och preferenser",
      icon: <Settings className="h-5 w-5" />,
      onClick: () => router.push("/settings"),
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Snabbåtgärder</CardTitle>
        <CardDescription>Vanliga åtgärder du kan utföra</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 justify-start text-left"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-md text-white mr-3 ${action.color}`}>{action.icon}</div>
              <div>
                <p className="font-medium">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
