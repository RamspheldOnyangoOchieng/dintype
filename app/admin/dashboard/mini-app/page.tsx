"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
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
    ToggleRight
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
}

type MiniAppStats = {
    total_users: number
    active_today: number
    total_interactions: number
    character_selections: number
}

export default function MiniAppManagementPage() {
    const { user, isLoading } = useAuth()
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
        }
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
                                        {typeof window !== 'undefined' ? window.location.origin : ''}/telegram
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
                                        {typeof window !== 'undefined' ? window.location.origin : ''}/telegram
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
