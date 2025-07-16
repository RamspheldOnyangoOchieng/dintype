"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { Home, Search, Trash2, Edit, Plus, Upload, Save, X, AlertTriangle, LinkIcon } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"

interface Banner {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  isActive: boolean
  createdAt: string
  linkUrl: string
}

export default function AdminBannersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [supabaseClient, setSupabaseClient] = useState(createClient())

  const [banners, setBanners] = useState<Banner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableBuckets, setAvailableBuckets] = useState<string[]>([])

  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    linkUrl: "",
  })

  // Fetch available buckets
  useEffect(() => {
    async function fetchBuckets() {
      try {
        const { data, error } = await supabaseClient.storage.listBuckets()
        if (error) {
          console.error("Error fetching buckets:", error)
          return
        }

        if (data && data.length > 0) {
          setAvailableBuckets(data.map((bucket) => bucket.name))
          console.log(
            "Available buckets:",
            data.map((bucket) => bucket.name),
          )
        }
      } catch (err) {
        console.error("Error fetching buckets:", err)
      }
    }

    if (user) {
      fetchBuckets()
    }
  }, [user, supabaseClient])

  // Fetch banners from Supabase
  useEffect(() => {
    async function fetchBanners() {
      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await supabaseClient
          .from("banners")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        // Convert snake_case to camelCase
        const formattedData = data.map((banner) => ({
          id: banner.id,
          imageUrl: banner.image_url,
          title: banner.title,
          subtitle: banner.subtitle,
          buttonText: banner.button_text,
          buttonLink: banner.button_link,
          linkUrl: banner.link_url,
          isActive: banner.is_active,
          createdAt: banner.created_at,
        }))

        setBanners(formattedData)
      } catch (err) {
        console.error("Error fetching banners:", err)
        setError("Misslyckades med att ladda banners. Försök igen.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchBanners()
    }
  }, [user, supabaseClient])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Refresh the Supabase client when the user changes to ensure auth is current
    if (user) {
      setSupabaseClient(createClient())
    }
  }, [user])

  // Filter banners based on search term
  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (banner.subtitle && banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Handle image upload with fallback options
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Check if we have any available buckets
      if (availableBuckets.length === 0) {
        toast({
          title: "Lagring inte tillgänglig",
          description: "Vänligen ange en bild-URL direkt istället.",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      // Use the first available bucket
      const bucketName = availableBuckets[0]

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `banner-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabaseClient.storage.from(bucketName).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Storage upload error:", error)
        throw error
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }))

      toast({
        title: "Bild uppladdad",
        description: "Bannerbilden har laddats upp.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Uppladdning misslyckades",
        description: "Kunde inte ladda upp bannerbilden. Ange en URL direkt istället.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddBanner = async () => {
    if (!formData.imageUrl || !formData.title || !formData.linkUrl) {
      toast({
        title: "Information saknas",
        description: "Vänligen ange en bild, titel och länk-URL för bannern.",
        variant: "destructive",
      })
      return
    }

    try {
      // Convert camelCase to snake_case for Supabase
      const { data, error } = await supabaseClient
        .from("banners")
        .insert([
          {
            image_url: formData.imageUrl,
            title: formData.title,
            subtitle: formData.subtitle || null,
            button_text: formData.buttonText || null,
            button_link: formData.buttonLink || null,
            link_url: formData.linkUrl,
            is_active: true,
          },
        ])
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      // Convert the returned data back to camelCase
      if (data && data.length > 0) {
        const newBanner: Banner = {
          id: data[0].id,
          imageUrl: data[0].image_url,
          title: data[0].title,
          subtitle: data[0].subtitle,
          buttonText: data[0].button_text,
          buttonLink: data[0].button_link,
          linkUrl: data[0].link_url,
          isActive: data[0].is_active,
          createdAt: data[0].created_at,
        }

        setBanners((prev) => [newBanner, ...prev])
      }

      setIsAdding(false)
      setFormData({
        imageUrl: "",
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        linkUrl: "",
      })

      toast({
        title: "Banner tillagd",
        description: "Den nya bannern har lagts till.",
      })
    } catch (err) {
      console.error("Error adding banner:", err)
      toast({
        title: "Fel",
        description: err instanceof Error ? err.message : "Kunde inte lägga till banner. Försök igen.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBanner = async () => {
    if (!isEditing) return

    if (!formData.imageUrl || !formData.title || !formData.linkUrl) {
      toast({
        title: "Information saknas",
        description: "Vänligen ange en bild, titel och länk-URL för bannern.",
        variant: "destructive",
      })
      return
    }

    try {
      // Convert camelCase to snake_case for Supabase
      const { error } = await supabaseClient
        .from("banners")
        .update({
          image_url: formData.imageUrl,
          title: formData.title,
          subtitle: formData.subtitle || null,
          button_text: formData.buttonText || null,
          button_link: formData.buttonLink || null,
          link_url: formData.linkUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", isEditing)

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      // Update local state
      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === isEditing
            ? {
                ...banner,
                imageUrl: formData.imageUrl,
                title: formData.title,
                subtitle: formData.subtitle,
                buttonText: formData.buttonText,
                buttonLink: formData.buttonLink,
                linkUrl: formData.linkUrl,
              }
            : banner,
        ),
      )

      setIsEditing(null)
      setFormData({
        imageUrl: "",
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        linkUrl: "",
      })

      toast({
        title: "Banner uppdaterad",
        description: "Bannern har uppdaterats.",
      })
    } catch (err) {
      console.error("Error updating banner:", err)
      toast({
        title: "Fel",
        description: err instanceof Error ? err.message : "Kunde inte uppdatera banner. Försök igen.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBanner = async (id: string) => {
    try {
      const { error } = await supabaseClient.from("banners").delete().eq("id", id)

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      setBanners((prev) => prev.filter((banner) => banner.id !== id))

      toast({
        title: "Banner borttagen",
        description: "Bannern har tagits bort.",
      })
    } catch (err) {
      console.error("Error deleting banner:", err)
      toast({
        title: "Fel",
        description: err instanceof Error ? err.message : "Kunde inte ta bort banner. Försök igen.",
        variant: "destructive",
      })
    }
  }

  const handleEditBanner = (banner: Banner) => {
    setIsEditing(banner.id)
    setFormData({
      imageUrl: banner.imageUrl,
      title: banner.title,
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      linkUrl: banner.linkUrl || "",
    })
  }

  const handleToggleActive = async (id: string) => {
    try {
      const banner = banners.find((b) => b.id === id)
      if (!banner) return

      const { error } = await supabaseClient.from("banners").update({ is_active: !banner.isActive }).eq("id", id)

      if (error) {
        throw error
      }

      setBanners((prev) =>
        prev.map((banner) => (banner.id === id ? { ...banner, isActive: !banner.isActive } : banner)),
      )

      toast({
        title: banner.isActive ? "Banner inaktiverad" : "Banner aktiverad",
        description: `Bannern har ${banner.isActive ? "inaktiverats" : "aktiverats"}.`,
      })
    } catch (err) {
      console.error("Error toggling banner status:", err)
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera bannerstatus. Försök igen.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-800">Laddar...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Bannerhantering</h2>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-gray-300 hover:bg-gray-100 text-gray-900 font-medium"
            >
              <Home className="mr-2 h-4 w-4" />
              Visa webbplats
            </Button>
          </header>

          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Reklambanners ({banners.length})</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Sök banners..."
                      className="pl-9 bg-white border-gray-300 text-gray-800 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                    onClick={() => setIsAdding(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Lägg till banner
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {/* Add/Edit Banner Form */}
              {(isAdding || isEditing) && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">{isAdding ? "Lägg till ny banner" : "Redigera banner"}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAdding(false)
                        setIsEditing(null)
                        setFormData({
                          imageUrl: "",
                          title: "",
                          subtitle: "",
                          buttonText: "",
                          buttonLink: "",
                          linkUrl: "",
                        })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bannerbild (1222x244px)</label>
                      <div className="flex flex-col gap-2">
                        {formData.imageUrl && (
                          <div className="relative w-full h-32 bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={formData.imageUrl || "/placeholder.svg"}
                              alt="Banner förhandsgranskning"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          {availableBuckets.length > 0 ? (
                            <label className="flex-1">
                              <div className="relative flex items-center justify-center w-full h-10 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageUpload}
                                  disabled={isUploading}
                                />
                                {isUploading ? (
                                  <span className="flex items-center">
                                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                                    Laddar upp...
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Ladda upp bild
                                  </span>
                                )}
                              </div>
                            </label>
                          ) : (
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                toast({
                                  title: "Lagring inte tillgänglig",
                                  description: "Vänligen ange en bild-URL direkt.",
                                })
                              }}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Använd bild-URL
                            </Button>
                          )}
                          <Input
                            placeholder="Ange bild-URL"
                            className="flex-1 bg-white border-gray-300 text-gray-800"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                        <Input
                          placeholder="Bannertitel"
                          className="bg-white border-gray-300 text-gray-800"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Underrubrik (valfritt)</label>
                        <Input
                          placeholder="Bannerunderrubrik"
                          className="bg-white border-gray-300 text-gray-800"
                          value={formData.subtitle}
                          onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner länk-URL (obligatorisk)
                      </label>
                      <Input
                        placeholder="/sida eller https://exempel.se"
                        className="bg-white border-gray-300 text-gray-800"
                        value={formData.linkUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Hela bannern kommer att vara klickbar och länka till denna URL
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Knapptext (valfritt)</label>
                      <Input
                        placeholder="Text för handlingsuppmaning"
                        className="bg-white border-gray-300 text-gray-800"
                        value={formData.buttonText}
                        onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Knapplänk (valfritt)</label>
                      <Input
                        placeholder="/sida eller https://exempel.se"
                        className="bg-white border-gray-300 text-gray-800"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData((prev) => ({ ...prev, buttonLink: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Om angiven kommer en knapp att visas på bannern med denna länk
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                      onClick={isAdding ? handleAddBanner : handleUpdateBanner}
                      disabled={!formData.imageUrl || !formData.title || !formData.linkUrl}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isAdding ? "Lägg till banner" : "Uppdatera banner"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Banners Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Bild</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Titel</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Länk</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Knapp</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Aktiv</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Skapad</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBanners.length > 0 ? (
                      filteredBanners.map((banner) => (
                        <tr key={banner.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="w-20 h-10 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={banner.imageUrl || "/placeholder.svg"}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{banner.title}</div>
                              {banner.subtitle && <div className="text-sm text-gray-500">{banner.subtitle}</div>}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">{banner.linkUrl}</span>
                          </td>
                          <td className="py-3 px-4">
                            {banner.buttonText ? (
                              <div className="flex flex-col">
                                <span className="text-sm">{banner.buttonText}</span>
                                {banner.buttonLink && (
                                  <span className="text-xs text-gray-500">{banner.buttonLink}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleToggleActive(banner.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                  banner.isActive ? "bg-blue-600" : "bg-gray-200"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                                    banner.isActive ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {format(new Date(banner.createdAt), "d MMM yyyy")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 min-h-[2rem]"
                                onClick={() => handleEditBanner(banner)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[2rem]"
                                onClick={() => handleDeleteBanner(banner.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          {searchTerm
                            ? "Inga banners hittades som matchar din sökning."
                            : "Inga banners hittades. Lägg till en för att komma igång."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
