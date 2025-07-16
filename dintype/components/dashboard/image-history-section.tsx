"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ImageIcon, Search, Download, RefreshCw, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import Image from "next/image"

interface GeneratedImage {
  id: string
  prompt: string
  image_url: string
  created_at: string
  language?: string
}

export function ImageHistorySection() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchImageHistory = async () => {
    try {
      const response = await fetch("/api/user-images", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch image history")
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error("Error fetching image history:", error)
      toast({
        title: "Fel",
        description: "Kunde inte hämta bildhistorik",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImageHistory()
  }, [])

  const filteredImages = images.filter((image) => image.prompt.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${prompt.slice(0, 30)}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda ner bilden",
        variant: "destructive",
      })
    }
  }

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
              <CardTitle>Bildhistorik</CardTitle>
              <CardDescription>Dina genererade bilder och prompts</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchImageHistory}>
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
                placeholder="Sök efter prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredImages.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga bilder hittades" : "Du har inga genererade bilder än"}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => (window.location.href = "/generate")}>
                    Generera din första bild
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=300&text=Bild+kunde+inte+laddas"
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(image.created_at), "d MMM", { locale: sv })}
                            </Badge>
                            {image.language && (
                              <Badge variant="outline" className="text-xs">
                                {image.language.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(image.image_url, image.prompt)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => window.open(image.image_url, "_blank")}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
