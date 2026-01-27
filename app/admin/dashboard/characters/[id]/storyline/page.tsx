"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ArrowLeft, BookOpen, Edit2, Plus, Trash2, Save, GripVertical, FileText, MessageSquare, Image as ImageIcon, Terminal, Check, ChevronLeft, Upload, Wand2, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner" // Using sonner as seen in app/layout.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface StoryChapter {
    id: string
    character_id: string
    chapter_number: number
    title: string
    tone: string
    description: string
    content: any // JSON
    system_prompt: string
    created_at: string
}

export default function CharacterStorylinePage() {
    const params = useParams()
    const router = useRouter()
    const characterId = params.id as string
    const supabase = createClient()

    const [chapters, setChapters] = useState<StoryChapter[]>([])
    const [characterName, setCharacterName] = useState("")
    const [character, setCharacter] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Selection State
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

    // Edit State
    const [formData, setFormData] = useState({
        chapter_number: 1,
        title: "",
        tone: "",
        description: "",
        content: "{}",
        system_prompt: ""
    })
    const [isDirty, setIsDirty] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [characterId])

    // If a chapter is selected, update form data
    useEffect(() => {
        if (selectedChapterId) {
            const chapter = chapters.find(c => c.id === selectedChapterId)
            if (chapter) {
                setFormData({
                    chapter_number: chapter.chapter_number,
                    title: chapter.title,
                    tone: chapter.tone || "",
                    description: chapter.description || "",
                    content: JSON.stringify(chapter.content, null, 2),
                    system_prompt: chapter.system_prompt || ""
                })
                setIsDirty(false)
            }
        }
    }, [selectedChapterId, chapters])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch character name
            // Fetch characters
            const { data: char, error: charError } = await supabase
                .from("characters")
                .select("*")
                .eq("id", characterId)
                .single()

            if (charError) throw charError
            // @ts-ignore
            setCharacter(char)
            // @ts-ignore
            setCharacterName(char?.name || "Unknown")

            // Fetch chapters
            // @ts-ignore
            const { data, error } = await supabase
                .from("story_chapters")
                .select("*")
                .eq("character_id", characterId)
                .order("chapter_number", { ascending: true })

            if (error) throw error
            const typedData = (data || []) as StoryChapter[]
            setChapters(typedData)

            // Select first chapter if available and none selected
            if (typedData.length > 0 && !selectedChapterId) {
                setSelectedChapterId(typedData[0].id)
            }

        } catch (error: any) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load storyline data")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNew = () => {
        // Create a new blank chapter local state or open a dialog?
        // Let's create a temporary object or reset selection to "new" mode
        // Simplest: Auto-create a draft row in DB? Better: Show "New" form.
        // For this UI, let's just create a new record immediately to simplify selection logic
        const nextNum = chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_number)) + 1 : 1

        const newChapter = {
            character_id: characterId,
            chapter_number: nextNum,
            title: `Chapter ${nextNum}`,
            content: { opening_message: "Start here..." }
        }

        insertChapter(newChapter)
    }

    const insertChapter = async (payload: any) => {
        // @ts-ignore
        const { data, error } = await supabase.from("story_chapters").insert(payload).select().single()
        if (error) {
            toast.error(error.message)
        } else {
            const newChapter = data as StoryChapter
            setChapters(prev => [...prev, newChapter])
            setSelectedChapterId(newChapter.id)
            toast.success("New chapter created")
        }
    }

    const handleSave = async () => {
        if (!selectedChapterId) return

        try {
            let parsedContent = {}
            try {
                parsedContent = JSON.parse(formData.content)
            } catch (e) {
                toast.error("Invalid JSON content")
                return
            }

            const updates = {
                chapter_number: formData.chapter_number,
                title: formData.title,
                tone: formData.tone,
                description: formData.description,
                content: parsedContent,
                system_prompt: formData.system_prompt,
                updated_at: new Date().toISOString()
            }

            // @ts-ignore
            const { error } = await (supabase as any)
                .from("story_chapters")
                .update(updates)
                .eq("id", selectedChapterId)

            if (error) throw error

            toast.success("Chapter saved successfully")
            setChapters(prev => prev.map(c => c.id === selectedChapterId ? { ...c, ...updates } as StoryChapter : c))
            setIsDirty(false)
        } catch (error: any) {
            toast.error("Error saving chapter: " + error.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this chapter?")) return

        try {
            // @ts-ignore
            const { error } = await supabase.from("story_chapters").delete().eq("id", id)
            if (error) throw error

            setChapters(prev => prev.filter(c => c.id !== id))
            if (selectedChapterId === id) setSelectedChapterId(null)
            toast.success("Chapter deleted")
        } catch (error: any) {
            toast.error("Error deleting chapter")
        }
    }

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file || !selectedChapterId) return

        setIsUploading(true)
        try {
            const base64 = await convertFileToBase64(file)

            const fd = new FormData()
            fd.append("file", base64)
            fd.append("folder", "storylines")

            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Upload failed")
            }
            const data = await res.json()

            // Update content JSON
            const currentContent = formData.content
            let parsed = { chapter_images: [] }
            try {
                parsed = JSON.parse(currentContent)
            } catch (e) {
                console.error("Error parsing existing content, creating new")
            }

            if (!parsed.chapter_images) parsed.chapter_images = []
            // @ts-ignore
            parsed.chapter_images[index] = data.secure_url

            setFormData({ ...formData, content: JSON.stringify(parsed, null, 2) })
            setIsDirty(true)
            toast.success(`Image ${index + 1} uploaded`)
        } catch (err: any) {
            console.error("Upload error:", err)
            toast.error(err.message || "Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    // State for Image Generation Dialog
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
    const [generateImageIndex, setGenerateImageIndex] = useState<number>(0)
    const [generatePrompt, setGeneratePrompt] = useState("")

    const openGenerateDialog = (index: number) => {
        // Pre-fill with existing metadata if available
        try {
            const parsed = JSON.parse(formData.content)
            const existingMeta = parsed.chapter_image_metadata?.[index] || ""
            setGeneratePrompt(existingMeta || `${character?.name || 'Character'} - ${formData.title || 'Storyline image'}`)
        } catch {
            setGeneratePrompt(`${character?.name || 'Character'} - ${formData.title || 'Storyline image'}`)
        }
        setGenerateImageIndex(index)
        setGenerateDialogOpen(true)
    }

    const handleGenerateImage = async () => {
        if (!generatePrompt.trim()) {
            toast.error("Please enter a description for the image")
            return
        }

        setGenerateDialogOpen(false)
        setIsGenerating(true)

        try {
            // 1. Get the session for authentication
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) {
                toast.error("You must be logged in to generate images")
                setIsGenerating(false)
                return
            }

            // 2. Convert character image to base64 for IP-Adapter (face consistency)
            let imageBase64 = null
            const charImageUrl = character?.image_url || character?.image
            if (charImageUrl) {
                try {
                    const { imageUrlToBase64 } = await import("@/lib/image-utils")
                    imageBase64 = await imageUrlToBase64(charImageUrl)
                    console.log("Character image converted for IP-Adapter")
                } catch (e) {
                    console.warn("Could not convert character image to base64:", e)
                }
            }

            // 3. Build the prompt with character context
            const style = character?.category === 'anime' ? 'Anime style' : 'Photorealistic, cinematic'
            const fullPrompt = `${style} portrait of ${character?.name || 'a person'}, ${generatePrompt}. High detail, masterpiece quality.`

            // 4. Call the generate API with proper auth
            const res = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`,
                    "x-user-id": session.user.id
                },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    negativePrompt: "low quality, blurry, distorted, deformed, bad anatomy, ugly",
                    selectedCount: 1,
                    size: "512x1024",
                    imageBase64, // IP-Adapter for character face consistency
                    character: {
                        name: character?.name,
                        ethnicity: character?.ethnicity,
                        category: character?.category
                    }
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || data.details || "Generation failed")
            }

            // 5. The API returns task_id(s) - we need to poll for result
            if (data.task_id) {
                toast.info("Image generation started. Polling for result...")

                // Poll for the result
                const taskIds = data.task_id.split(',')
                const firstTaskId = taskIds[0]

                let attempts = 0
                const maxAttempts = 60 // ~2 minutes with 2s interval

                const pollForResult = async (): Promise<string | null> => {
                    while (attempts < maxAttempts) {
                        attempts++
                        await new Promise(resolve => setTimeout(resolve, 2000))

                        const statusRes = await fetch(`/api/check-generation?taskId=${firstTaskId}`, {
                            headers: {
                                "Authorization": `Bearer ${session.access_token}`
                            }
                        })

                        if (statusRes.ok) {
                            const statusData = await statusRes.json()

                            if (statusData.status === 'TASK_STATUS_SUCCEED' && statusData.images?.length > 0) {
                                return statusData.images[0].image_url || statusData.images[0]
                            } else if (statusData.status === 'TASK_STATUS_FAILED') {
                                throw new Error(statusData.reason || "Generation failed")
                            }
                            // Still processing, continue polling
                        }
                    }
                    return null
                }

                const resultImageUrl = await pollForResult()

                if (resultImageUrl) {
                    // Upload to Cloudinary for permanent storage
                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: (() => {
                            const fd = new FormData()
                            fd.append("file", resultImageUrl)
                            fd.append("folder", "storylines")
                            return fd
                        })()
                    })

                    let finalUrl = resultImageUrl
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json()
                        finalUrl = uploadData.secure_url || resultImageUrl
                    }

                    // Update the chapter content
                    const parsed = (() => {
                        try { return JSON.parse(formData.content) }
                        catch { return {} }
                    })()

                    if (!parsed.chapter_images) parsed.chapter_images = []
                    parsed.chapter_images[generateImageIndex] = finalUrl

                    // Also save the prompt as metadata
                    if (!parsed.chapter_image_metadata) parsed.chapter_image_metadata = []
                    parsed.chapter_image_metadata[generateImageIndex] = generatePrompt

                    setFormData({ ...formData, content: JSON.stringify(parsed, null, 2) })
                    setIsDirty(true)
                    toast.success(`Image ${generateImageIndex + 1} generated successfully!`)
                } else {
                    throw new Error("Image generation timed out")
                }
            } else if (data.imageUrl || (data.images && data.images.length > 0)) {
                // Direct URL response (fallback)
                const url = data.imageUrl || data.images[0]
                const parsed = (() => {
                    try { return JSON.parse(formData.content) }
                    catch { return {} }
                })()

                if (!parsed.chapter_images) parsed.chapter_images = []
                parsed.chapter_images[generateImageIndex] = url

                setFormData({ ...formData, content: JSON.stringify(parsed, null, 2) })
                setIsDirty(true)
                toast.success(`Image ${generateImageIndex + 1} generated!`)
            } else {
                throw new Error("No image returned from generation")
            }
        } catch (err: any) {
            console.error("Generation error:", err)
            toast.error(err.message || "Failed to generate image")
        } finally {
            setIsGenerating(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-400">Loading storyline...</div>

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-background text-foreground">
            {/* Header */}
            {/* Header - Always visible now to access buttons on mobile */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-4 border-b border-border bg-card/50 gap-4 shrink-0">
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-hidden">
                    {/* Mobile Back to List Button - Only shows when editing a chapter */}
                    <div className={`${selectedChapterId ? 'block md:hidden' : 'hidden'}`}>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedChapterId(null)} className="text-gray-400 hover:text-white shrink-0 -ml-2">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => router.back()} className={`${selectedChapterId ? 'hidden md:flex' : 'flex'} text-gray-400 hover:text-white shrink-0`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="min-w-0 flex-1 lg:flex-none">
                        <h1 className="text-lg font-bold flex items-center gap-2 truncate">
                            <BookOpen className="h-5 w-5 text-primary shrink-0" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-md">{characterName}</span>
                            <span className="text-muted-foreground shrink-0">/</span>
                            <span className="shrink-0">Storyline</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-row gap-3 w-full lg:w-auto">
                    <Button onClick={handleCreateNew} variant="secondary" className="flex-1 lg:flex-none h-10 w-full lg:w-auto px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="whitespace-nowrap">Add Chapter</span>
                    </Button>
                    <Button onClick={handleSave} disabled={!isDirty || !selectedChapterId} className={`flex-1 lg:flex-none h-10 w-full lg:w-auto px-6 ${isDirty ? "animate-pulse" : ""}`}>
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Sidebar List */}
                <div className={`
                    w-full md:w-80 border-b md:border-b-0 md:border-r border-border flex-col bg-card
                    ${selectedChapterId ? 'hidden md:flex' : 'flex'}
                    md:min-h-full h-full
                `}>
                    <div className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider flex justify-between items-center bg-muted/30 md:bg-transparent">
                        <div className="flex items-center gap-4">
                            <span>Chapters ({chapters.length})</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-1 p-2">
                            {chapters.map((chapter) => (
                                <div
                                    key={chapter.id}
                                    onClick={() => setSelectedChapterId(chapter.id)}
                                    className={`
                                group flex items-start p-4 md:p-3 rounded-lg cursor-pointer transition-all border border-transparent mb-2 md:mb-0
                                ${selectedChapterId === chapter.id
                                            ? "bg-primary/10 border-primary/20 text-primary"
                                            : "bg-muted/50 md:bg-transparent border-border/50 md:border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                                        }
                            `}
                                >
                                    <div className={`
                                mt-0.5 mr-3 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                ${selectedChapterId === chapter.id ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-muted/80"}
                            `}>
                                        {chapter.chapter_number}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-base md:text-sm">{chapter.title}</div>
                                        <div className="text-sm md:text-xs opacity-60 truncate">{chapter.description || "No description"}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 md:h-6 md:w-6 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 hover:bg-red-400/10 -mt-1 -mr-1 shrink-0"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(chapter.id); }}
                                    >
                                        <Trash2 className="h-4 w-4 md:h-3 md:w-3" />
                                    </Button>
                                </div>
                            ))}
                            {chapters.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-sm italic">
                                    No chapters yet. Click "Add Chapter" to begin.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className={`
                    flex-1 flex-col bg-background min-h-[500px]
                    ${selectedChapterId ? 'flex' : 'hidden md:flex'}
                `}>
                    {selectedChapterId ? (
                        <div className="h-full flex flex-col">
                            <Tabs defaultValue="details" className="flex-1 flex flex-col">
                                <div className="px-6 py-2 border-b border-border bg-muted/50">
                                    <TabsList className="bg-muted w-full justify-start overflow-x-auto whitespace-nowrap h-auto py-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                        <TabsTrigger value="details" className="shrink-0">Details & Tone</TabsTrigger>
                                        <TabsTrigger value="visual" className="shrink-0">Visual Builder</TabsTrigger>
                                        <TabsTrigger value="images" className="shrink-0">Chapter Images (6)</TabsTrigger>
                                        <TabsTrigger value="content" className="shrink-0">Raw JSON (Advanced)</TabsTrigger>
                                        <TabsTrigger value="prompt" className="shrink-0">System Prompt</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex-1 p-4 md:p-6 pb-20 overflow-x-auto min-w-0">
                                    <TabsContent value="images" className="mt-0 space-y-6 w-full">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[0, 1, 2, 3, 4, 5].map((idx) => {
                                                const parsed = (() => {
                                                    try { return JSON.parse(formData.content) }
                                                    catch { return {} }
                                                })()
                                                const imageUrl = parsed.chapter_images?.[idx]

                                                return (
                                                    <Card key={idx} className="bg-card border-border overflow-hidden group">
                                                        <CardHeader className="p-3 bg-muted/50 flex flex-row items-center justify-between">
                                                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Slot {idx + 1}</CardTitle>
                                                            {imageUrl && <Check className="h-3 w-3 text-green-500" />}
                                                        </CardHeader>
                                                        <CardContent className="p-4 space-y-4">
                                                            <div className="aspect-[9/16] relative bg-muted/30 rounded-lg overflow-hidden border border-border/50 mb-4 group-hover:border-primary/30 transition-colors">
                                                                {imageUrl ? (
                                                                    <img src={imageUrl} alt={`Chapter Image ${idx + 1}`} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-2">
                                                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                                                        <span className="text-[10px] uppercase font-medium">Empty Slot</span>
                                                                    </div>
                                                                )}
                                                                {(isUploading || isGenerating) && (
                                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                                                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="relative">
                                                                    <input
                                                                        type="file"
                                                                        id={`upload-${idx}`}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageUpload(e, idx)}
                                                                        disabled={isUploading || isGenerating}
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="w-full text-[10px] h-8 gap-1 border-border hover:bg-muted"
                                                                        onClick={() => document.getElementById(`upload-${idx}`)?.click()}
                                                                        disabled={isUploading || isGenerating}
                                                                    >
                                                                        <Upload className="h-3 w-3" /> Upload
                                                                    </Button>
                                                                </div>
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="w-full text-[10px] h-8 gap-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                                                                    onClick={() => openGenerateDialog(idx)}
                                                                    disabled={isUploading || isGenerating}
                                                                >
                                                                    <Wand2 className="h-3 w-3" /> AI Gen
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">AI Context / Meta Data</label>
                                                                <textarea
                                                                    className="w-full text-xs min-h-[60px] bg-muted/30 border border-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary/30"
                                                                    placeholder="Describe this photo (e.g. 'me at the beach', 'wearing a red dress')..."
                                                                    value={parsed.chapter_image_metadata?.[idx] || ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value
                                                                        const newParsed = { ...parsed }
                                                                        if (!newParsed.chapter_image_metadata) newParsed.chapter_image_metadata = []
                                                                        newParsed.chapter_image_metadata[idx] = val
                                                                        setFormData({ ...formData, content: JSON.stringify(newParsed, null, 2) })
                                                                        setIsDirty(true)
                                                                    }}
                                                                />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                        <p className="text-xs text-muted-foreground italic mt-4">
                                            Tip: These 6 images will be used by the AI to progress the chapter visual narrative.
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="visual" className="mt-0 space-y-8 w-full">
                                        {/* Visual Editor Logic */}
                                        {(() => {
                                            let parsed = { opening_message: "", branches: [] };
                                            let isValid = true;
                                            try {
                                                parsed = JSON.parse(formData.content);
                                                if (!parsed.branches) parsed.branches = [];
                                            } catch (e) {
                                                isValid = false;
                                            }

                                            if (!isValid) {
                                                return (
                                                    <div className="p-8 text-center border border-red-900/50 bg-red-900/10 rounded-xl">
                                                        <h3 className="text-red-400 font-bold mb-2">Invalid JSON Detected</h3>
                                                        <p className="text-gray-400 text-sm">
                                                            The content in the "Raw JSON" tab contains syntax errors.
                                                            Please fix them before using the Visual Builder.
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            const updateContent = (newObj: any) => {
                                                setFormData({ ...formData, content: JSON.stringify(newObj, null, 2) });
                                                setIsDirty(true);
                                            };

                                            const updateBranch = (index: number, field: string, value: string) => {
                                                const newBranches = [...(parsed.branches || []) as any[]];
                                                newBranches[index] = { ...newBranches[index], [field]: value };
                                                updateContent({ ...parsed, branches: newBranches });
                                            };

                                            const addBranch = () => {
                                                const newBranches = [...(parsed.branches || []) as any[], { label: "New Choice", response_message: "..." }];
                                                updateContent({ ...parsed, branches: newBranches });
                                            };

                                            const removeBranch = (index: number) => {
                                                const newBranches = [...(parsed.branches || []) as any[]];
                                                newBranches.splice(index, 1);
                                                updateContent({ ...parsed, branches: newBranches });
                                            };

                                            return (
                                                <div className="space-y-8 animate-in fade-in duration-300">
                                                    {/* Opening Message Section */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-lg font-semibold text-primary">Opening Message</Label>
                                                            <Badge variant="outline" className="bg-primary/5 border-primary/20">Step 1</Badge>
                                                        </div>
                                                        <Card className="bg-card border-border shadow-sm">
                                                            <CardContent className="p-4">
                                                                <Textarea
                                                                    value={parsed.opening_message || ""}
                                                                    onChange={(e) => updateContent({ ...parsed, opening_message: e.target.value })}
                                                                    className="min-h-[120px] bg-muted/30 border-border/50 text-base leading-relaxed"
                                                                    placeholder="What does the character say to start this chapter?"
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    <Separator className="bg-border/50" />

                                                    {/* Branches Section */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <Label className="text-lg font-semibold text-blue-400">Player Choices (Branches)</Label>
                                                                <p className="text-xs text-gray-500 mt-1">Define what options the player has and how the character responds.</p>
                                                            </div>
                                                            <Button onClick={addBranch} size="sm" variant="secondary" className="gap-2">
                                                                <Plus className="h-4 w-4" /> Add Choice
                                                            </Button>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-4">
                                                            {/* @ts-ignore */}
                                                            {parsed.branches?.map((branch: any, idx: number) => (
                                                                <Card key={idx} className="bg-card border-border relative group overflow-hidden shadow-sm">
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/80 to-purple-500/80"></div>
                                                                    <CardContent className="p-4 pl-6 space-y-4">
                                                                        <div className="flex gap-4">
                                                                            <div className="flex-1 space-y-2">
                                                                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Player Option Label</Label>
                                                                                <Input
                                                                                    value={branch.label || ""}
                                                                                    onChange={(e) => updateBranch(idx, "label", e.target.value)}
                                                                                    className="bg-muted/30 border-border/50 font-medium"
                                                                                    placeholder="e.g. 'Tell me more'"
                                                                                />
                                                                            </div>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeBranch(idx)}
                                                                                className="text-gray-500 hover:text-red-400 hover:bg-black/20 self-start mt-6"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs text-gray-400 uppercase tracking-wider">Character Response</Label>
                                                                            <Textarea
                                                                                value={branch.response_message || ""}
                                                                                onChange={(e) => updateBranch(idx, "response_message", e.target.value)}
                                                                                className="min-h-[80px] bg-black/20 border-white/5 resize-none"
                                                                                placeholder="How does the character respond to this choice?"
                                                                            />
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}

                                                            {(!parsed.branches || parsed.branches.length === 0) && (
                                                                <div className="p-8 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-500 gap-2">
                                                                    <p>No branches defined yet.</p>
                                                                    <Button variant="outline" onClick={addBranch}>Create First Choice</Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </TabsContent>
                                    <TabsContent value="details" className="mt-0 space-y-6 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-1">
                                                <Label>Number</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.chapter_number}
                                                    onChange={e => { setFormData({ ...formData, chapter_number: parseInt(e.target.value) }); setIsDirty(true); }}
                                                    className="bg-black/20 border-white/10"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <Label>Chapter Title</Label>
                                                <Input
                                                    value={formData.title}
                                                    onChange={e => { setFormData({ ...formData, title: e.target.value }); setIsDirty(true); }}
                                                    className="bg-black/20 border-white/10 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Description (Internal)</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={e => { setFormData({ ...formData, description: e.target.value }); setIsDirty(true); }}
                                                className="bg-black/20 border-white/10 h-24 resize-none"
                                                placeholder="Brief summary of what happens in this chapter..."
                                            />
                                        </div>

                                        <div>
                                            <Label>Tone / Pacing</Label>
                                            <Input
                                                value={formData.tone}
                                                onChange={e => { setFormData({ ...formData, tone: e.target.value }); setIsDirty(true); }}
                                                className="bg-black/20 border-white/10"
                                                placeholder="e.g. Suspenseful, Romantic, Fast-paced"
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="content" className="mt-0 h-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-20">
                                            <div className="space-y-2 flex flex-col">
                                                <Label className="flex items-center gap-2">
                                                    <Terminal className="h-4 w-4 text-primary" />
                                                    JSON Structure
                                                </Label>
                                                <Card className="bg-[#111] border-white/10 flex-1 flex flex-col">
                                                    <CardContent className="p-0 flex-1">
                                                        <Textarea
                                                            value={formData.content}
                                                            onChange={e => { setFormData({ ...formData, content: e.target.value }); setIsDirty(true); }}
                                                            className="w-full h-full min-h-[500px] font-mono text-sm bg-transparent border-none focus-visible:ring-0 p-4 leading-relaxed text-green-400/90"
                                                            spellCheck="false"
                                                        />
                                                    </CardContent>
                                                </Card>
                                                <div className="text-xs text-gray-500">
                                                    Must include 'opening_message' and 'branches' array.
                                                </div>
                                            </div>

                                            <div className="bg-[#111] rounded-xl border border-white/10 p-4 space-y-4 overflow-y-auto">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <FileText className="h-4 w-4 text-blue-400" />
                                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-400">Preview Structure</h3>
                                                </div>

                                                {/* Simple Visualizer */}
                                                <div className="space-y-4">
                                                    <div className="bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                                                        <div className="text-xs text-gray-500 mb-1">Opening Message</div>
                                                        <div className="text-sm italic text-gray-300">
                                                            {(() => {
                                                                try { return JSON.parse(formData.content).opening_message || "..." }
                                                                catch { return "Invalid JSON" }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-2">Branches</div>
                                                        <div className="space-y-2">
                                                            {(() => {
                                                                try {
                                                                    const branches = JSON.parse(formData.content).branches || []
                                                                    if (!Array.isArray(branches)) return <div className="text-red-500 text-xs">No branches array</div>
                                                                    if (branches.length === 0) return <div className="text-gray-500 text-xs">No branches defined</div>
                                                                    return branches.map((b: any, i: number) => (
                                                                        <div key={i} className="flex gap-2">
                                                                            <div className="w-1 bg-white/20 rounded-full"></div>
                                                                            <div className="flex-1 bg-[#1a1a1a] p-2 rounded border border-white/5">
                                                                                <div className="font-bold text-xs text-primary mb-1">{b.label}</div>
                                                                                <div className="text-xs text-gray-400 line-clamp-2">{b.response_message}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                                catch { return null }
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="prompt" className="mt-0 w-full">
                                        <Label className="mb-2 block">Chapter-Specific System Prompt Prompt</Label>
                                        <Card className="bg-amber-950/10 border-amber-900/30">
                                            <CardContent className="p-4">
                                                <Textarea
                                                    value={formData.system_prompt}
                                                    onChange={e => { setFormData({ ...formData, system_prompt: e.target.value }); setIsDirty(true); }}
                                                    className="bg-transparent border-none min-h-[300px] resize-none focus-visible:ring-0 text-amber-100/80"
                                                    placeholder="Override the character's base system prompt for this specific chapter context..."
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                            <p>Select a chapter to edit or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Generation Prompt Dialog */}
            <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-primary" />
                            Generate Image for Slot {generateImageIndex + 1}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="generate-prompt">Image Description</Label>
                            <Textarea
                                id="generate-prompt"
                                placeholder="Describe the image you want to generate... (e.g., 'wearing a red dress at sunset, romantic mood, smiling')"
                                value={generatePrompt}
                                onChange={(e) => setGeneratePrompt(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <p className="text-xs text-muted-foreground">
                                The character's face will be preserved using IP-Adapter technology for consistency.
                            </p>
                        </div>
                        {character && (
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <img
                                    src={character.image || character.image_url || "/placeholder.svg"}
                                    alt={character.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                                />
                                <div>
                                    <p className="text-sm font-medium">{character.name}</p>
                                    <p className="text-xs text-muted-foreground">Face reference for generation</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleGenerateImage}
                            disabled={!generatePrompt.trim() || isGenerating}
                            className="gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate Image
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
