"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Shield, Edit } from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface ProfileSectionProps {
  user: {
    id: string
    username?: string
    email?: string
    avatar?: string
    isAdmin?: boolean
    createdAt?: string
  }
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Profilinformation</CardTitle>
            <CardDescription>Din kontoinformation och inställningar</CardDescription>
          </div>
          <Button variant="outline" onClick={() => router.push("/profile")}>
            <Edit className="mr-2 h-4 w-4" />
            Redigera
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{user.username || "Användare"}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {user.isAdmin ? (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">Användare</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Medlem sedan{" "}
                  {user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy", { locale: sv }) : "Okänt"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
