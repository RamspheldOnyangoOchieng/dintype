"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { Home, Search, Trash2, Edit, Plus, Upload, Save, X, AlertTriangle, LinkIcon, ExternalLink, Sparkles, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { SimpleImageGenerator } from "@/components/simple-image-generator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

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
  const [showGenerationModal, setShowGenerationModal] = useState(false)

  const [formData, setFormData] = useState<any>({
    imageUrl: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    linkUrl: "",
  })

  // Helper to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Fetch banners from Supabase
  useEffect(() => {
    async function fetchBanners() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/banners")
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch banners")
        }

        const data = result.banners

        // Convert snake_case to camelCase
        const formattedData = data.map((banner: any) => ({
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
      } catch (err: any) {
        console.error("Error fetching banners:", err)
        setError(err.message || "Failed to load banners. Please try again.")
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

  // Handle image upload with server-side logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Use the same server-side upload logic as characters
      const base64String = await convertFileToBase64(file)

      const formDataUpload = new FormData()
      formDataUpload.append("file", base64String)
      formDataUpload.append("folder", "banners")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to upload image")
      }

      const result = await response.json()

      if (!result.secure_url) {
        throw new Error("No URL returned from upload")
      }

      setFormData((prev: any) => ({ ...prev, imageUrl: result.secure_url }))

      toast({
        title: "Success",
        description: "The banner image has been uploaded to Cloudinary.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload the banner image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset input
      const input = document.getElementById('image-upload') as HTMLInputElement
      if (input) input.value = ''
    }
  }

  // Handle AI image generation landing
  const handleGeneratedImage = (imageUrl: string) => {
    setFormData((prev: any) => ({ ...prev, imageUrl }))
    toast({
      title: "AI Image Ready",
      description: "Generated asset applied to banner draft.",
    })
  }

  const handleAddBanner = async () => {
    if (!formData.imageUrl || !formData.title || !formData.linkUrl) {
      toast({
        title: "Missing information",
        description: "Please provide an image, title, and link URL for the banner.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banner: {
            image_url: formData.imageUrl,
            title: formData.title,
            subtitle: formData.subtitle || null,
            button_text: formData.buttonText || null,
            button_link: formData.buttonLink || null,
            link_url: formData.linkUrl,
            is_active: true,
          }
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to add banner")

      const data = result.banner

      // Convert the returned data back to camelCase
      const newBanner: Banner = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.button_text,
        buttonLink: data.button_link,
        linkUrl: data.link_url,
        isActive: data.is_active,
        createdAt: data.created_at,
      }

      setBanners((prev: Banner[]) => [newBanner, ...prev])

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
        title: "Banner added",
        description: "The new banner has been added successfully.",
      })
    } catch (err) {
      console.error("Error adding banner:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add banner. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBanner = async () => {
    if (!isEditing) return

    if (!formData.imageUrl || !formData.title || !formData.linkUrl) {
      toast({
        title: "Missing information",
        description: "Please provide an image, title, and link URL for the banner.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: isEditing,
          banner: {
            image_url: formData.imageUrl,
            title: formData.title,
            subtitle: formData.subtitle || null,
            button_text: formData.buttonText || null,
            button_link: formData.buttonLink || null,
            link_url: formData.linkUrl,
            updated_at: new Date().toISOString(),
          }
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to update banner")

      // Update local state
      setBanners((prev: Banner[]) =>
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
        title: "Banner updated",
        description: "The banner has been updated successfully.",
      })
    } catch (err) {
      console.error("Error updating banner:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update banner. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBanner = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: "DELETE"
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to delete banner")

      setBanners((prev: Banner[]) => prev.filter((banner) => banner.id !== id))

      toast({
        title: "Banner deleted",
        description: "The banner has been deleted successfully.",
      })
    } catch (err) {
      console.error("Error deleting banner:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete banner. Please try again.",
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

      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          banner: { is_active: !banner.isActive }
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to toggle banner")

      setBanners((prev: Banner[]) =>
        prev.map((banner) => (banner.id === id ? { ...banner, isActive: !banner.isActive } : banner)),
      )

      toast({
        title: banner.isActive ? "Banner deactivated" : "Banner activated",
        description: `The banner has been ${banner.isActive ? "deactivated" : "activated"} successfully.`,
      })
    } catch (err) {
      console.error("Error toggling banner status:", err)
      toast({
        title: "Error",
        description: "Failed to update banner status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Promotional Banners
            <Badge variant="secondary" className="bg-[#252525] text-[#00A3FF] border-[#333] font-black">
              {banners.length}
            </Badge>
          </h1>
          <p className="text-gray-400 mt-1 font-medium italic">High-impact visibility controls for your platform assets.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00A3FF] transition-colors" />
            <Input
              placeholder="Search banners..."
              className="pl-10 bg-[#1A1A1A] border-[#252525] text-white focus:border-[#00A3FF]/50 focus:ring-[#00A3FF]/20 h-11 rounded-xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#00A3FF] hover:bg-[#0082CC] text-white font-black h-11 px-6 rounded-xl shadow-lg shadow-[#00A3FF]/20 transition-all active:scale-95"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Add/Edit Banner Modal */}
      <Dialog open={isAdding || !!isEditing} onOpenChange={(open) => {
        if (!open) {
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
        }
      }}>
        <DialogContent className="max-w-4xl bg-[#1A1A1A] border-[#252525] text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{isAdding ? "Create New Campaign" : "Optimize Banner"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure the visual and functional aspects of your banner.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-8 mt-4">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Visual Asset Preview</label>
              <div className="relative aspect-[1222/244] w-full bg-[#0F0F0F] border border-[#252525] rounded-2xl overflow-hidden group shadow-inner border-dashed">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <Upload className="h-10 w-10 mb-3 opacity-20" />
                    <span className="text-xs font-bold opacity-30">Recommended: 1222 x 244 pixels</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[#00A3FF] text-xs font-black uppercase tracking-widest">Processing</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Direct Asset URL"
                    className="pl-10 bg-[#0F0F0F] border-[#252525] text-white h-12 rounded-xl focus:border-[#00A3FF]/50 transition-all font-mono text-sm"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-12 px-6 border-[#252525] bg-[#0F0F0F] hover:bg-[#252525] hover:text-white text-gray-400 rounded-xl transition-all"
                  disabled={isUploading}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Campaign Title</label>
                <Input
                  placeholder="e.g. Premium Experience"
                  className="bg-[#0F0F0F] border-[#252525] text-white h-12 rounded-xl focus:border-[#00A3FF] transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Redirect Slug/URL</label>
                <Input
                  placeholder="/premium or http://..."
                  className="bg-[#0F0F0F] border-[#252525] text-white h-12 rounded-xl font-mono text-xs"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, linkUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Supporting Text</label>
                <Input
                  placeholder="Detailed description of the promotion"
                  className="bg-[#0F0F0F] border-[#252525] text-white h-12 rounded-xl"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">CTA Button Label</label>
                <Input
                  placeholder="e.g. Go Premium"
                  className="bg-[#0F0F0F] border-[#252525] text-white h-12 rounded-xl"
                  value={formData.buttonText}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, buttonText: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Button Redirect</label>
                <Input
                  placeholder="/checkout"
                  className="bg-[#0F0F0F] border-[#252525] text-white h-12 rounded-xl font-mono text-xs"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, buttonLink: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center gap-4 pt-6 border-t border-[#252525] mt-6">
            <div className="flex-1">
              <Button
                variant="outline"
                className="border-[#252525] bg-transparent hover:bg-white/5 text-gray-400 font-bold h-12 px-6 rounded-xl transition-all"
                onClick={() => setShowGenerationModal(true)}
                disabled={isUploading}
                type="button"
              >
                <Sparkles className="h-4 w-4 mr-2 text-[#00A3FF]" />
                Generate AI Content
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-white hover:bg-white/5 font-bold h-12 px-8 rounded-xl"
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
                type="button"
              >
                Discard
              </Button>
              <Button
                className="bg-[#00A3FF] hover:bg-[#0082CC] text-white font-black h-12 px-10 rounded-xl shadow-xl shadow-[#00A3FF]/20 transition-all active:scale-95"
                onClick={isAdding ? handleAddBanner : handleUpdateBanner}
                disabled={!formData.imageUrl || !formData.title || !formData.linkUrl || isUploading}
                type="button"
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-5 w-5" />
                )}
                {isAdding ? "Finalize Campaign" : "Apply Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simple AI Generation Modal */}
      <SimpleImageGenerator
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onImageSelect={handleGeneratedImage}
        type="banner"
        settings={{
          width: 1222,
          height: 244,
          size: "1222x244",
          aspectRatioLabel: "Wide Banner",
          title: "Generate Banner Content"
        }}
      />

      {/* Error Feedback */}
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400 rounded-2xl p-6 border-dashed">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="font-bold underline decoration-red-500/50 decoration-2 underline-offset-4">{error}</AlertDescription>
        </Alert>
      )}

      {/* Modern Banners Table */}
      <div className="bg-[#1A1A1A] border border-[#252525] rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#252525] bg-[#141414]/80">
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Image</th>
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Creative Details</th>
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Link</th>
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">CTA Configuration</th>
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Deployment</th>
                <th className="py-6 px-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="hover:bg-white/[0.02] transition-all group duration-300">
                  <td className="py-6 px-8">
                    <div className="relative w-[130px] aspect-[122/44] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-[#00A3FF]/40 transition-all duration-500">
                      <Image
                        src={banner.imageUrl || "/placeholder.svg"}
                        alt={banner.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-white leading-tight group-hover:text-[#00A3FF] transition-colors">{banner.title}</span>
                      {banner.subtitle && (
                        <span className="text-xs text-gray-500 mt-1.5 line-clamp-1 max-w-[200px] leading-relaxed italic">{banner.subtitle}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2 group/link">
                      <code className="text-[11px] font-bold text-gray-400 bg-[#252525] px-2 py-1 rounded-md border border-[#333] transition-colors group-hover/link:text-white group-hover/link:border-white/20">{banner.linkUrl}</code>
                      <ExternalLink className="h-3 w-3 text-gray-600 opacity-0 group-hover/link:opacity-100 transition-all" />
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    {banner.buttonText ? (
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs font-black text-white px-2 py-1 bg-white/5 rounded-md inline-block w-fit">{banner.buttonText}</span>
                        {banner.buttonLink && (
                          <span className="text-[10px] text-gray-500 font-mono pl-1">{banner.buttonLink}</span>
                        )}
                      </div>
                    ) : (
                      <div className="h-6 w-12 bg-[#252525] rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-gray-600 font-black">-</span>
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={() => handleToggleActive(banner.id)}
                        className="data-[state=checked]:bg-[#00A3FF] data-[state=unchecked]:bg-[#333] scale-110"
                      />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        banner.isActive ? "text-[#00A3FF]" : "text-gray-600"
                      )}>
                        {banner.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white tracking-widest uppercase">
                        {format(new Date(banner.createdAt), "dd MMM")}
                      </span>
                      <span className="text-[9px] text-gray-600 font-medium">
                        {format(new Date(banner.createdAt), "yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-500 hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 rounded-xl transition-all border border-transparent hover:border-[#00A3FF]/20"
                        onClick={() => handleEditBanner(banner)}
                        title="Edit Campaign"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                        onClick={() => handleDeleteBanner(banner.id)}
                        title="Remove Content"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBanners.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-40 text-center">
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <div className="w-20 h-20 bg-[#252525] rounded-full flex items-center justify-center mb-6 border border-[#333]">
                        <Search className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">Creative Void</h3>
                      <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                        {searchTerm
                          ? `We couldn't find any results matching "${searchTerm}". Try a different filter.`
                          : "Your promotional pipeline is currently empty. Start by adding a banner to engage your users."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
