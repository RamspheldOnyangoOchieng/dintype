"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Search, User, RefreshCw, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface ChatHistory {
  id: string
  character_name: string
  character_id: string
  message_count: number
  last_message_at: string
  created_at: string
}

export function ChatHistorySection() {
  const [chats, setChats] = useState<ChatHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const fetchChatHistory = async () => {
    try {
      const response = await fetch("/api/user/chat-history", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch chat history")
      }

      const data = await response.json()
      setChats(data.chats || [])
    } catch (error) {
      console.error("Error fetching chat history:", error)
      toast({
        title: "Fel",
        description: "Kunde inte hämta chatthistorik",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const filteredChats = chats.filter((chat) => chat.character_name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Chatthistorik</CardTitle>
              <CardDescription>Dina senaste konversationer med AI-karaktärer</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchChatHistory}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Uppdatera
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök efter karaktär..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga chattar hittades" : "Du har inga chattar än"}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => router.push("/chat")}>
                    Starta din första chatt
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{chat.character_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{chat.message_count} meddelanden</span>
                          <span>•</span>
                          <span>Senast aktiv {format(new Date(chat.last_message_at), "PPp", { locale: sv })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{chat.message_count} msg</Badge>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/chat/${chat.id}`)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Öppna
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
