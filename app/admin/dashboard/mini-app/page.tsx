"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
import { useSite } from "@/components/site-context"
import {
    Settings,
    RefreshCw,
    Save,
    ExternalLink,
    Smartphone,
    Palette,
    Code,
    Globe,
    Activity,
    Users,
    MessageSquare,
    ToggleLeft,
    ToggleRight,
    User,
    Upload,
    Trash2,
    Image as ImageIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

type MiniAppSettings = {
    enabled: boolean
    bot_username: string
    app_name: string
    short_name: string
    description: string
    theme_color: string
    header_color: string
    background_color: string
    button_color: string
    button_text_color: string
    features: {
        character_selection: boolean
        image_generation: boolean
        character_creation: boolean
        premium_features: boolean
    }
    bot_name?: string
    about_text?: string
    bot_avatar_url?: string
}

type MiniAppStats = {
    total_users: number
    active_today: number
    total_interactions: number
    character_selections: number
}

export default function MiniAppManagementPage() {
    const { user, isLoading } = useAuth()
    const { settings: siteSettings } = useSite()
    const router = useRouter()
    const [settings, setSettings] = useState<MiniAppSettings>({
        enabled: true,
        bot_username: "pocketlove_bot",
        app_name: "PocketLove Mini",
        short_name: "PocketLove",
        description: "Your AI companion in Telegram",
        theme_color: "#ff0080",
        header_color: "#000000",
        background_color: "#0b0b0b",
        button_color: "#ff0080",
        button_text_color: "#ffffff",
        features: {
            character_selection: true,
            image_generation: true,
            character_creation: true,
            premium_features: true,
        },
        bot_name: "PocketLove",
        about_text: "Your AI companion",
        bot_avatar_url: ""
    })

    const [stats, setStats] = useState<MiniAppStats>({
        total_users: 0,
        active_today: 0,
        total_interactions: 0,
        character_selections: 0
    })

    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")
    const [loadingStats, setLoadingStats] = useState(true)

    useEffect(() => {
        if (!isLoading && (!user || !user.isAdmin)) {
            router.push("/admin/login")
        }
    }, [user, isLoading, router])

    useEffect(() => {
        loadSettings()
        loadStats()
    }, [])

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings?key=telegram_mini_app')
            if (response.ok) {
                const data = await response.json()
                if (data.value) {
                    setSettings(prev => ({ ...prev, ...data.value }))
                }
            }
        } catch (err) {
            console.error("Error loading mini app settings:", err)
        }
    }

    const loadStats = async () => {
        try {
            setLoadingStats(true)
            const response = await fetch('/api/telegram/stats')
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (err) {
            console.error("Error loading stats:", err)
        } finally {
            setLoadingStats(false)
        }
    }

    const [syncing, setSyncing] = useState(false)
    const [syncResult, setSyncResult] = useState<any>(null)

    const handleSyncToTelegram = async () => {
        setSyncing(true)
        setSyncResult(null)
        try {
            const response = await fetch('/api/admin/telegram/sync-bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: settings.bot_name,
                    short_description: settings.about_text,
                    description: settings.description
                })
            })
            const data = await response.json()
            if (data.success) {
                setSaveMessage("Bot identity synced to Telegram!")
                setSyncResult(data.results)
                setTimeout(() => setSaveMessage(""), 3000)
            } else {
                setSaveMessage("Sync failed: " + data.error)
            }
        } catch (err) {
            console.error("Sync error:", err)
            setSaveMessage("Error syncing with Telegram")
        } finally {
            setSyncing(false)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setSaving(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'pocketlove')

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await response.json()
            if (data.secure_url) {
                setSettings(prev => ({ ...prev, bot_avatar_url: data.secure_url }))
                setSaveMessage("Avatar uploaded! Remember to save all settings.")
                setTimeout(() => setSaveMessage(""), 3000)
            }
        } catch (err) {
            console.error("Upload error:", err)
            setSaveMessage("Failed to upload avatar")
        } finally {
            setSaving(false)
        }
    }

    const handleSaveSettings = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'telegram_mini_app',
                    value: settings
                })
            })

            if (response.ok) {
                setSaveMessage("Settings saved successfully!")
                setTimeout(() => setSaveMessage(""), 3000)
            } else {
                setSaveMessage("Failed to save settings")
            }
        } catch (err) {
            console.error("Error saving settings:", err)
            setSaveMessage("Error saving settings")
        } finally {
            setSaving(false)
        }
    }

    const effectiveSiteUrl = siteSettings.siteUrl ? siteSettings.siteUrl.replace(/\/$/, '') : (typeof window !== 'undefined' ? window.location.origin : '')

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
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Smartphone className="h-8 w-8" />
                        Telegram Mini App Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Configure and monitor your Telegram Mini App
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={loadStats} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Stats
                    </Button>
                    <Button
                        onClick={() => window.open(`https://t.me/${settings.bot_username}`, '_blank')}
                        variant="outline"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Bot
                    </Button>
                </div>
            </div>

            {saveMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">{saveMessage}</AlertDescription>
                </Alert>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {loadingStats ? "..." : stats.total_users.toLocaleString()}
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {loadingStats ? "..." : stats.active_today.toLocaleString()}
                            </div>
                            <Activity className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Interactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {loadingStats ? "..." : stats.total_interactions.toLocaleString()}
                            </div>
                            <MessageSquare className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Character Selections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold">
                                {loadingStats ? "..." : stats.character_selections.toLocaleString()}
                            </div>
                            <Users className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 h-auto">
                    <TabsTrigger value="general" className="gap-2">
                        <Settings className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="features" className="gap-2">
                        <Code className="h-4 w-4" />
                        Features
                    </TabsTrigger>
                    <TabsTrigger value="integration" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Integration
                    </TabsTrigger>
                    <TabsTrigger value="identity" className="gap-2">
                        <User className="h-4 w-4" />
                        Bot Identity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Basic configuration for your mini app</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Enable Mini App</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Turn the Telegram mini app on or off
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enabled}
                                    onCheckedChange={(checked) =>
                                        setSettings(prev => ({ ...prev, enabled: checked }))
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="botUsername">Bot Username</Label>
                                    <Input
                                        id="botUsername"
                                        value={settings.bot_username}
                                        onChange={(e) => setSettings(prev => ({ ...prev, bot_username: e.target.value }))}
                                        placeholder="your_bot_username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="appName">App Name</Label>
                                    <Input
                                        id="appName"
                                        value={settings.app_name}
                                        onChange={(e) => setSettings(prev => ({ ...prev, app_name: e.target.value }))}
                                        placeholder="Your App Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shortName">Short Name</Label>
                                    <Input
                                        id="shortName"
                                        value={settings.short_name}
                                        onChange={(e) => setSettings(prev => ({ ...prev, short_name: e.target.value }))}
                                        placeholder="Short name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={settings.description}
                                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe your mini app..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Color Scheme</CardTitle>
                            <CardDescription>Customize the visual appearance of your mini app</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="themeColor">Theme Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="themeColor"
                                            type="color"
                                            value={settings.theme_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, theme_color: e.target.value }))}
                                            className="w-20 h-10"
                                        />
                                        <Input
                                            value={settings.theme_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, theme_color: e.target.value }))}
                                            placeholder="#ff0080"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="headerColor">Header Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="headerColor"
                                            type="color"
                                            value={settings.header_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, header_color: e.target.value }))}
                                            className="w-20 h-10"
                                        />
                                        <Input
                                            value={settings.header_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, header_color: e.target.value }))}
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="backgroundColor">Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="backgroundColor"
                                            type="color"
                                            value={settings.background_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, background_color: e.target.value }))}
                                            className="w-20 h-10"
                                        />
                                        <Input
                                            value={settings.background_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, background_color: e.target.value }))}
                                            placeholder="#0b0b0b"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="buttonColor">Button Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="buttonColor"
                                            type="color"
                                            value={settings.button_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, button_color: e.target.value }))}
                                            className="w-20 h-10"
                                        />
                                        <Input
                                            value={settings.button_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, button_color: e.target.value }))}
                                            placeholder="#ff0080"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="buttonTextColor"
                                            type="color"
                                            value={settings.button_text_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, button_text_color: e.target.value }))}
                                            className="w-20 h-10"
                                        />
                                        <Input
                                            value={settings.button_text_color}
                                            onChange={(e) => setSettings(prev => ({ ...prev, button_text_color: e.target.value }))}
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Toggles</CardTitle>
                            <CardDescription>Enable or disable specific features in the mini app</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Character Selection</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow users to select and chat with characters
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.features.character_selection}
                                    onCheckedChange={(checked) =>
                                        setSettings(prev => ({
                                            ...prev,
                                            features: { ...prev.features, character_selection: checked }
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Image Generation</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable AI image generation feature
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.features.image_generation}
                                    onCheckedChange={(checked) =>
                                        setSettings(prev => ({
                                            ...prev,
                                            features: { ...prev.features, image_generation: checked }
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Character Creation</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow users to create custom characters
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.features.character_creation}
                                    onCheckedChange={(checked) =>
                                        setSettings(prev => ({
                                            ...prev,
                                            features: { ...prev.features, character_creation: checked }
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Premium Features</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable premium subscription features
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.features.premium_features}
                                    onCheckedChange={(checked) =>
                                        setSettings(prev => ({
                                            ...prev,
                                            features: { ...prev.features, premium_features: checked }
                                        }))
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="identity" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Editor */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bot Profile Details</CardTitle>
                                <CardDescription>Manage how your bot appears to users in Telegram</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="botName">Display Name</Label>
                                    <Input
                                        id="botName"
                                        value={settings.bot_name}
                                        onChange={(e) => setSettings(prev => ({ ...prev, bot_name: e.target.value }))}
                                        placeholder="PocketLove"
                                    />
                                    <p className="text-xs text-muted-foreground">The name users see at the top of the chat</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="aboutText">About (Short Description)</Label>
                                    <Input
                                        id="aboutText"
                                        value={settings.about_text}
                                        onChange={(e) => setSettings(prev => ({ ...prev, about_text: e.target.value }))}
                                        placeholder="Your AI companion"
                                    />
                                    <p className="text-xs text-muted-foreground">Shown in the bot's profile and search results</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="longDescription">Description (Full)</Label>
                                    <Textarea
                                        id="longDescription"
                                        value={settings.description}
                                        onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="What can this bot do?..."
                                        rows={4}
                                    />
                                    <p className="text-xs text-muted-foreground">Shown when a user clicks 'What can this bot do?'</p>
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-base font-bold">Bot Avatar</Label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                                            {settings.bot_avatar_url ? (
                                                <img src={settings.bot_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" size="sm" className="relative cursor-pointer" asChild>
                                                <label>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload New Photo
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                                </label>
                                            </Button>
                                            {settings.bot_avatar_url && (
                                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setSettings(prev => ({ ...prev, bot_avatar_url: "" }))}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-2 font-medium">
                                        Note: Telegram API does not support setting the official bot avatar yet.
                                        Please upload this image to @BotFather manually.
                                    </p>
                                </div>

                                <Button
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleSyncToTelegram}
                                    disabled={syncing}
                                >
                                    {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                                    Sync Name & About to Telegram
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Telegram Profile Preview */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-lg px-2">Telegram Profile Preview</h3>
                            <div className="bg-[#17212b] rounded-2xl shadow-2xl overflow-hidden text-white font-sans max-w-[360px] mx-auto w-full border border-slate-700">
                                {/* Header / Top Bar */}
                                <div className="p-4 flex items-center gap-4 border-b border-[#0e161e]">
                                    <div className="relative w-16 h-16 rounded-full bg-[#2b5278] flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {settings.bot_avatar_url ? (
                                            <img src={settings.bot_avatar_url} alt="Bot" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold">{(settings.bot_name || "P").charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-bold truncate">{settings.bot_name || "PocketLove"}</h4>
                                        <p className="text-[#6c7883] text-sm">bot</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex p-4 gap-4 border-b border-[#0e161e]">
                                    <div className="flex-1 bg-[#242f3d] py-2 rounded-lg flex flex-col items-center gap-1 cursor-pointer hover:bg-[#2b394a] transition-colors">
                                        <MessageSquare className="w-5 h-5 text-[#4ea4f6]" />
                                        <span className="text-[#4ea4f6] text-xs font-medium">Message</span>
                                    </div>
                                    <div className="flex-1 bg-[#242f3d] py-2 rounded-lg flex flex-col items-center gap-1 cursor-pointer hover:bg-[#2b394a] transition-colors">
                                        <Activity className="w-5 h-5 text-[#4ea4f6]" />
                                        <span className="text-[#4ea4f6] text-xs font-medium">Mute</span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-4 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 flex justify-center pt-1">
                                            <Users className="w-5 h-5 text-[#6c7883]" />
                                        </div>
                                        <div>
                                            <p className="text-[#4ea4f6] font-medium">@{settings.bot_username || "pocketloveaibot"}</p>
                                            <p className="text-[#6c7883] text-xs">Username</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 flex justify-center pt-1">
                                            <ImageIcon className="w-5 h-5 text-[#6c7883]" />
                                        </div>
                                        <div>
                                            <p className="text-white">4 photos</p>
                                            <p className="text-[#6c7883] text-xs">Media gallery</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 space-y-4">
                                        <div className="flex items-center justify-between text-[#4ea4f6] cursor-pointer hover:bg-slate-800/50 p-1 rounded">
                                            <span className="text-sm font-medium">Bot Privacy Policy</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[#ef5350] cursor-pointer hover:bg-slate-800/50 p-1 rounded">
                                            <span className="text-sm font-medium">Report</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[#ef5350] cursor-pointer hover:bg-slate-800/50 p-1 rounded">
                                            <span className="text-sm font-medium">Stop and block bot</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="integration" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Integration Details</CardTitle>
                            <CardDescription>Information for integrating with Telegram</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <Globe className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-medium mb-2">Mini App URL</p>
                                    <code className="bg-muted px-2 py-1 rounded text-sm">
                                        {effectiveSiteUrl}/telegram
                                    </code>
                                </AlertDescription>
                            </Alert>

                            <Alert>
                                <Code className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-medium mb-2">Bot Setup Command</p>
                                    <p className="text-sm">Use BotFather to set your mini app:</p>
                                    <code className="bg-muted px-2 py-1 rounded text-sm block mt-2">
                                        /newapp<br />
                                        @{settings.bot_username}<br />
                                        {settings.app_name}<br />
                                        {settings.description}<br />
                                        {effectiveSiteUrl}/telegram
                                    </code>
                                </AlertDescription>
                            </Alert>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => window.open('https://t.me/BotFather', '_blank')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open BotFather
                                </Button>
                                <Button
                                    onClick={() => window.open('https://core.telegram.org/bots/webapps', '_blank')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Documentation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    size="lg"
                    className="gap-2"
                >
                    {saving ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save All Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
