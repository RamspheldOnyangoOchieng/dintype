"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import {
    Upload,
    Trash2,
    Image as ImageIcon,
    User,
    Settings,
    RefreshCw,
    Save,
    ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"

type TelegramProfile = {
    id: string
    telegram_user_id: string
    username?: string
    first_name?: string
    last_name?: string
    profile_image_url?: string
    bio?: string
    created_at: string
    updated_at: string
}

export default function TelegramProfilesPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [profiles, setProfiles] = useState<TelegramProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<TelegramProfile | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [saveMessage, setSaveMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const supabase = createClient()

    useEffect(() => {
        if (!isLoading && (!user || !user.isAdmin)) {
            router.push("/admin/login")
        }
    }, [user, isLoading, router])

    useEffect(() => {
        fetchProfiles()
    }, [])

    const fetchProfiles = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('telegram_users')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProfiles(data || [])
        } catch (err) {
            console.error("Error fetching Telegram profiles:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUploadImage = async () => {
        if (!imageFile || !selectedProfile) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', imageFile)
            formData.append('upload_preset', 'dintype')

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await response.json()
            const imageUrl = data.secure_url

            // Update profile with new image
            const { error } = await supabase
                .from('telegram_users')
                .update({ profile_image_url: imageUrl })
                .eq('id', selectedProfile.id)

            if (error) throw error

            setSaveMessage("Profile image updated successfully!")
            setTimeout(() => setSaveMessage(""), 3000)
            fetchProfiles()
            setImageFile(null)
            setImagePreview("")
        } catch (err) {
            console.error("Error uploading image:", err)
            setSaveMessage("Failed to upload image")
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteImage = async (profileId: string) => {
        try {
            const { error } = await supabase
                .from('telegram_users')
                .update({ profile_image_url: null })
                .eq('id', profileId)

            if (error) throw error

            setSaveMessage("Profile image deleted successfully!")
            setTimeout(() => setSaveMessage(""), 3000)
            fetchProfiles()
        } catch (err) {
            console.error("Error deleting image:", err)
        }
    }

    const filteredProfiles = profiles.filter(profile =>
        profile.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.telegram_user_id?.includes(searchQuery)
    )

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    if (!user || !user.isAdmin) {
        return null
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Telegram Profile Images</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage profile images for Telegram users
                    </p>
                </div>
                <Button onClick={fetchProfiles} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {saveMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">{saveMessage}</AlertDescription>
                </Alert>
            )}

            {/* Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Search by username, name, or Telegram ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-lg"
                    />
                </CardContent>
            </Card>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading profiles...</p>
                    </div>
                ) : filteredProfiles.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No Telegram profiles found</p>
                    </div>
                ) : (
                    filteredProfiles.map((profile) => (
                        <Card key={profile.id} className="overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {profile.profile_image_url ? (
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                                                <Image
                                                    src={profile.profile_image_url}
                                                    alt={profile.username || "Profile"}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-lg">
                                                {profile.first_name || "Unknown"} {profile.last_name || ""}
                                            </CardTitle>
                                            {profile.username && (
                                                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-xs text-muted-foreground">
                                    <p>ID: {profile.telegram_user_id}</p>
                                    <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setSelectedProfile(profile)}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                    </Button>
                                    {profile.profile_image_url && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteImage(profile.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {selectedProfile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Upload Profile Image</CardTitle>
                            <CardDescription>
                                Upload a new profile image for {selectedProfile.first_name || "this user"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="imageUpload">Select Image</Label>
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="mt-2"
                                />
                            </div>

                            {imagePreview && (
                                <div className="relative w-full aspect-square max-w-xs mx-auto rounded-lg overflow-hidden">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleUploadImage}
                                    disabled={!imageFile || uploading}
                                    className="flex-1"
                                >
                                    {uploading ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Image
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedProfile(null)
                                        setImageFile(null)
                                        setImagePreview("")
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
