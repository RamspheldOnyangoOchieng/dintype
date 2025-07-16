"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ChevronLeft, ChevronRight, Menu, ImageIcon, Loader2, ChevronDown, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { useSidebar } from "@/components/sidebar-context"
import { useCharacters } from "@/components/character-context"
import { sendChatMessage, type Message } from "@/lib/chat-actions"
import { checkNovitaApiKey } from "@/lib/api-key-utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { ClearChatDialog } from "@/components/clear-chat-dialog"
import { DebugPanel } from "@/components/debug-panel"
import {
  saveMessageToLocalStorage,
  getChatHistoryFromLocalStorage,
  clearChatHistoryFromLocalStorage,
} from "@/lib/local-storage-chat"
import { SupabaseDebug } from "@/components/supabase-debug"
import { isAskingForImage, extractImagePrompt, imageUrlToBase64 } from "@/lib/image-utils"
import { PhoneCallDialog } from "@/components/phone-call-dialog"
import { useTranslation } from "react-i18next"
import { useTranslations } from "@/lib/use-translations"
import { TranslatedText } from "@/components/translated-text"
import { ImageModal } from "@/components/image-modal"

export default function ChatPage({ params }: { params: { id: string } }) {
  const characterId = params.id
  const { characters } = useCharacters()
  const character = characters.find((char) => char.id === String(characterId)) || characters[0]
  const { toggle, setIsOpen } = useSidebar()
  const router = useRouter()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { t } = useTranslation()
  const { t: t2 } = useTranslations()

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClearingChat, setIsClearingChat] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [isMounted, setIsMounted] = useState(false)
  const [chatsWithHistory, setChatsWithHistory] = useState<string[]>([])
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState<string | null>(null)
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState<Record<string, boolean>>({})
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})
  const [showVideo, setShowVideo] = useState(false)
  // Remove these state variables
  // const [showImageGenerationPopup, setShowImageGenerationPopup] = useState(false)
  // const [generationPrompt, setGenerationPrompt] = useState("")
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  // Use a ref for the interval to ensure we always have the latest reference
  const imageCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Use a ref to track if we're currently processing an image
  const isProcessingImageRef = useRef(false)

  // Use a ref to store the current task ID
  const currentTaskIdRef = useRef<string | null>(null)

  // Add debug state
  const [debugInfo, setDebugInfo] = useState({
    characterId: characterId,
    messagesCount: 0,
    lastError: null as any,
    lastAction: "none",
    storageType: "localStorage",
  })

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Automatically open sidebar on mobile when navigating to a chat
  useEffect(() => {
    if (isMounted) {
      // Check if we're on mobile
      const isMobile = window.innerWidth < 768

      // If on mobile, automatically open the sidebar
      if (isMobile) {
        setIsOpen(true)
        console.log("Automatically opening sidebar on mobile")
      }
    }
  }, [isMounted, setIsOpen])

  // Load characters with chat history
  useEffect(() => {
    if (!isMounted) return

    try {
      // Get all characters that have chat history
      const characterIds = characters
        .filter((character) => {
          const history = getChatHistoryFromLocalStorage(character.id)
          return history && history.length > 0
        })
        .map((character) => character.id)

      setChatsWithHistory(characterIds)
    } catch (error) {
      console.error("Failed to load characters with history:", error)
    }
  }, [characters, isMounted, messages])

  // Handle image error
  const handleImageError = useCallback(
    (id: string) => {
      if (!isMounted) return

      setImageErrors((prev) => ({
        ...prev,
        [id]: true,
      }))
    },
    [isMounted],
  )

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isMounted) return

    // Use a timeout to ensure the DOM has been updated
    const scrollTimeout = setTimeout(() => {
      if (messagesEndRef.current) {
        try {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        } catch (error) {
          console.error("Error scrolling to bottom:", error)
          // Fallback to a simpler scroll method
          try {
            messagesEndRef.current.scrollIntoView()
          } catch (fallbackError) {
            console.error("Fallback scroll also failed:", fallbackError)
          }
        }
      }
    }, 100)

    return () => clearTimeout(scrollTimeout)
  }, [messages, isMounted])

  // Check API key
  useEffect(() => {
    if (!isMounted) return

    let isCancelled = false

    async function validateApiKey() {
      try {
        const result = await checkNovitaApiKey()
        if (!isCancelled && result && !result.valid) {
          setApiKeyError(result.message)
        }
      } catch (error) {
        console.error("Error validating API key:", error)
      }
    }

    validateApiKey()

    return () => {
      isCancelled = true
    }
  }, [isMounted])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      try {
        if (imageCheckIntervalRef.current) {
          clearInterval(imageCheckIntervalRef.current)
          imageCheckIntervalRef.current = null
        }
      } catch (error) {
        console.error("Error cleaning up interval:", error)
      }
    }
  }, [])

  // Load chat history from localStorage
  const loadChatHistory = useCallback(() => {
    if (!character || !isMounted) {
      console.log("Missing character or component not mounted, skipping chat history load")
      setIsLoadingHistory(false)
      return
    }

    setIsLoadingHistory(true)
    setDebugInfo((prev) => ({
      ...prev,
      characterId,
      lastAction: "loadingHistory",
    }))

    try {
      console.log("Loading chat history for character:", characterId)

      // Get history from localStorage
      const history = getChatHistoryFromLocalStorage(characterId)

      console.log(`Loaded ${history.length} messages from localStorage`)
      setDebugInfo((prev) => ({
        ...prev,
        messagesCount: history.length,
        lastAction: "historyLoaded",
      }))

      if (history.length > 0) {
        setMessages(history)
      } else {
        console.log("No history found, setting default welcome message")
        // Set default welcome message if no history
        const welcomeMessage: Message = {
          id: "1",
          role: "assistant",
          content: `Hej där! Jag är ${character.name}. Det är jättekul att träffa dig! Vad heter du?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages([welcomeMessage])

        // Save welcome message to localStorage
        saveMessageToLocalStorage(characterId, welcomeMessage)
      }
    } catch (error) {
      console.error("Error loading chat history:", error)
      setDebugInfo((prev) => ({ ...prev, lastError: error, lastAction: "historyError" }))

      // Set default message on error
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hej där! Jag är ${character.name}. Det är jättekul att träffa dig! Vad heter du?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsLoadingHistory(false)
    }
  }, [character, characterId, isMounted])

  // Effect to load chat history when component mounts or character changes
  useEffect(() => {
    if (isMounted) {
      loadChatHistory()
    }
  }, [loadChatHistory, isMounted])

  // Add this inside the ChatPage component function, after the other useEffect hooks:
  // Effect to log character data when it changes
  useEffect(() => {
    if (character) {
      console.log("Character data:", {
        id: character.id,
        name: character.name,
        video_url: character.video_url,
      })
    }
  }, [character])

  // Function to clear any existing image check interval
  const clearImageCheckInterval = useCallback(() => {
    try {
      console.log("Clearing image check interval")
      if (imageCheckIntervalRef.current) {
        clearInterval(imageCheckIntervalRef.current)
        imageCheckIntervalRef.current = null
      }
    } catch (error) {
      console.error("Error clearing image check interval:", error)
    }
  }, [])

  // Function to generate speech for a message
  const generateSpeech = async (messageId: string, text: string) => {
    if (!isMounted || isGeneratingSpeech[messageId]) return

    // If we already have an audio URL for this message, play it
    if (audioUrls[messageId]) {
      playAudio(messageId, audioUrls[messageId])
      return
    }

    try {
      // Set loading state for this message
      setIsGeneratingSpeech((prev) => ({ ...prev, [messageId]: true }))

      console.log("Generating speech for message:", messageId)

      // Call the API to generate speech
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: character?.gender === "female" ? "Emily" : "James", // Choose voice based on character gender
          language: "en-US",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Text-to-speech API error:", errorData)
        throw new Error(errorData.error || "Failed to generate speech")
      }

      const data = await response.json()

      if (!data.taskId) {
        console.error("Missing task_id in response:", data)
        throw new Error("Invalid response from text-to-speech API")
      }

      const taskId = data.taskId
      console.log("Speech generation started with task ID:", taskId)

      // Poll for the speech generation result
      const checkSpeechStatus = async () => {
        try {
          console.log("Checking speech status for task:", taskId)
          const statusResponse = await fetch(`/api/check-speech-task?taskId=${taskId}`)

          if (!statusResponse.ok) {
            const errorData = await statusResponse.json()
            console.error("Check speech status API error:", errorData)
            throw new Error(errorData.error || "Failed to check speech status")
          }

          const statusData = await statusResponse.json()
          console.log("Speech status check result:", statusData)

          if (statusData.status === "TASK_STATUS_SUCCEED" && statusData.audioUrl) {
            // Speech generation successful
            console.log("Speech generation successful, audio URL:", statusData.audioUrl)
            setIsGeneratingSpeech((prev) => ({ ...prev, [messageId]: false }))
            setAudioUrls((prev) => ({ ...prev, [messageId]: statusData.audioUrl }))

            // Play the audio
            playAudio(messageId, statusData.audioUrl)
          } else if (statusData.status === "TASK_STATUS_FAILED") {
            // Speech generation failed
            console.error("Speech generation failed")
            setIsGeneratingSpeech((prev) => ({ ...prev, [messageId]: false }))
          } else {
            // Still processing, check again after a delay
            console.log("Speech generation still processing, checking again in 1 second")
            setTimeout(checkSpeechStatus, 1000)
          }
        } catch (error) {
          console.error("Error checking speech status:", error)
          setIsGeneratingSpeech((prev) => ({ ...prev, [messageId]: false }))
        }
      }

      // Start checking the status
      checkSpeechStatus()
    } catch (error) {
      console.error("Error generating speech:", error)
      setIsGeneratingSpeech((prev) => ({ ...prev, [messageId]: false }))
    }
  }

  // Function to play audio
  const playAudio = (messageId: string, audioUrl: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Create a new audio element
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      // Set the currently playing message ID
      setCurrentlyPlayingMessageId(messageId)

      // Play the audio
      audio.play()

      // When the audio ends, reset the currently playing message ID
      audio.onended = () => {
        setCurrentlyPlayingMessageId(null)
      }

      // Handle errors
      audio.onerror = () => {
        console.error("Error playing audio")
        setCurrentlyPlayingMessageId(null)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setCurrentlyPlayingMessageId(null)
    }
  }

  // Function to stop audio playback
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setCurrentlyPlayingMessageId(null)
    }
  }

  // Function to generate an image
  const generateImage = async (prompt: string) => {
    if (!isMounted) return

    try {
      // If already generating an image, don't start another one
      if (isGeneratingImage) {
        console.log("Already generating an image, ignoring request")
        return
      }

      // Clear any existing interval first
      clearImageCheckInterval()

      // Reset processing state
      isProcessingImageRef.current = false
      currentTaskIdRef.current = null

      setIsGeneratingImage(true)

      // Get the character's image URL
      const characterImageUrl = character?.image || "/placeholder.svg"

      // Add a loading message to the chat
      const loadingMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "assistant",
        content: "Jag skapar den bilden åt dig. Det är klart om ett ögonblick...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      if (isMounted) {
        setMessages((prev) => [...prev, loadingMessage])
        saveMessageToLocalStorage(characterId, loadingMessage)
      }

      // Convert the image to base64
      console.log("Converting image to base64:", characterImageUrl)
      const base64Image = await imageUrlToBase64(characterImageUrl)

      if (!base64Image) {
        throw new Error("Failed to convert image to base64")
      }

      if (!isMounted) return

      console.log("Base64 conversion successful, length:", base64Image.length)

      // Try the real API first
      let response
      let responseData
      let useMockApi = false

      try {
        // Make the API request to the real endpoint
        response = await fetch("/api/img2img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            negativePrompt: "bad quality, worst quality, low quality",
            imageBase64: base64Image,
          }),
        })

        responseData = await response.json()

        if (!response.ok || !responseData.taskId) {
          console.warn("Real API failed, falling back to mock API:", responseData)
          useMockApi = true
        }
      } catch (error) {
        console.warn("Error with real API, falling back to mock API:", error)
        useMockApi = true
      }

      if (!isMounted) return

      // If the real API failed, use the mock API
      if (useMockApi) {
        console.log("Using mock image generation API")
        response = await fetch("/api/mock-img2img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        })

        responseData = await response.json()

        if (!response.ok) {
          console.error("Mock API error:", responseData)
          throw new Error(responseData.error || "Failed to start image generation")
        }
      }

      if (!responseData.taskId) {
        console.error("Missing taskId in response:", responseData)
        throw new Error("Invalid response from image generation API")
      }

      if (!isMounted) return

      // Store the task ID
      const newTaskId = responseData.taskId
      currentTaskIdRef.current = newTaskId
      console.log("Image generation started with task ID:", newTaskId)

      // Start polling for results
      const checkEndpoint = useMockApi ? "/api/mock-check-generation" : "/api/check-generation"

      // Instead of using setInterval, we'll use a recursive setTimeout approach
      // This ensures we only have one check running at a time and can completely
      // control when the next check happens
      const checkImageStatus = async () => {
        // If component is unmounted or we're already processing, don't continue
        if (!isMounted || isProcessingImageRef.current || !currentTaskIdRef.current) {
          console.log("Skipping image check - component unmounted, already processing, or no current task")
          return
        }

        try {
          // Set processing flag to prevent multiple simultaneous checks
          isProcessingImageRef.current = true

          console.log("Checking image status for task:", currentTaskIdRef.current)
          const response = await fetch(`${checkEndpoint}?taskId=${currentTaskIdRef.current}`)

          if (!response.ok) {
            throw new Error("Failed to check image status")
          }

          const data = await response.json()
          console.log("Image status check result:", data.status)

          if (!isMounted) {
            isProcessingImageRef.current = false
            return
          }

          if (data.status === "TASK_STATUS_SUCCEED" && data.images && data.images.length > 0) {
            // Image generation successful
            console.log("Image generation successful")
            setGeneratedImageUrl(data.images[0])
            setIsGeneratingImage(false)

            // Add the generated image to the chat
            const imageMessage: Message = {
              id: Math.random().toString(36).substring(2, 15),
              role: "assistant",
              content: "Här är bilden du begärde:",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isImage: true,
              imageUrl: data.images[0],
            }

            setMessages((prev) => [...prev, imageMessage])
            saveMessageToLocalStorage(characterId, imageMessage)

            // Clear task ID and processing flag
            currentTaskIdRef.current = null
            isProcessingImageRef.current = false

            // Don't schedule another check
            return
          } else if (data.status === "TASK_STATUS_FAILED") {
            // Image generation failed
            console.log("Image generation failed")
            setIsGeneratingImage(false)

            // Add error message to chat
            const errorMessage: Message = {
              id: Math.random().toString(36).substring(2, 15),
              role: "assistant",
              content: "Tyvärr, jag kunde inte skapa den bilden. Låt oss prova något annat.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }

            setMessages((prev) => [...prev, errorMessage])
            saveMessageToLocalStorage(characterId, errorMessage)

            // Clear task ID and processing flag
            currentTaskIdRef.current = null
            isProcessingImageRef.current = false

            // Don't schedule another check
            return
          }

          // For other statuses (PENDING, RUNNING), continue polling
          isProcessingImageRef.current = false

          // Schedule the next check only if we still have a valid task ID and component is mounted
          if (currentTaskIdRef.current && isMounted) {
            setTimeout(checkImageStatus, 2000)
          }
        } catch (error) {
          console.error("Error checking image status:", error)

          if (!isMounted) return

          // Add error message to chat
          const errorMessage: Message = {
            id: Math.random().toString(36).substring(2, 15),
            role: "assistant",
            content: "Förlåt, jag hade problem med att skapa den bilden. Låt oss prova något annat.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setMessages((prev) => [...prev, errorMessage])
          saveMessageToLocalStorage(characterId, errorMessage)

          setIsGeneratingImage(false)

          // Clear task ID and processing flag
          currentTaskIdRef.current = null
          isProcessingImageRef.current = false
        }
      }

      // Start the first check after a short delay
      setTimeout(checkImageStatus, 2000)
    } catch (error) {
      console.error("Error generating image:", error)

      if (!isMounted) return

      setIsGeneratingImage(false)
      currentTaskIdRef.current = null
      isProcessingImageRef.current = false

      // Add error message to chat
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "assistant",
        content: "Tyvärr, jag kunde inte skapa den bilden. Det uppstod ett tekniskt problem med bildbehandlingen.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, errorMessage])
      saveMessageToLocalStorage(characterId, errorMessage)
    }
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!isMounted) return

    if (inputValue.trim() && !isLoading) {
      // Reset any previous API key errors
      setApiKeyError(null)
      setDebugInfo((prev) => ({ ...prev, lastAction: "sendingMessage" }))

      // Create new user message
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "user",
        content: inputValue,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Add user message to chat
      setMessages((prev) => [...prev, newMessage])
      setInputValue("")
      setIsLoading(true)

      try {
        // Save user message to localStorage
        saveMessageToLocalStorage(characterId, newMessage)
        setDebugInfo((prev) => ({ ...prev, lastAction: "userMessageSaved" }))

        // Check if the user is asking for an image
        if (isAskingForImage(newMessage.content)) {
          // Extract the image prompt
          const imagePrompt = extractImagePrompt(newMessage.content)

          // Generate the image
          setIsLoading(false)
          await generateImage(imagePrompt)
          return
        }

        // Get system prompt from character
        const systemPrompt =
          character?.systemPrompt ||
          `You are ${character?.name}, a ${character?.age}-year-old ${character?.occupation}. ${character?.description}`

        // Send message to API
        const aiResponse = await sendChatMessage([...messages, newMessage], systemPrompt)

        if (!isMounted) return

        // Check if the response indicates an API key error
        if (aiResponse.content.includes("trouble connecting") || aiResponse.content.includes("try again")) {
          setApiKeyError("There might be an issue with the API key. Please check your Novita API key configuration.")
        }

        // Create assistant message
        const assistantMessage = {
          id: aiResponse.id,
          role: "assistant" as const,
          content: aiResponse.content,
          timestamp: aiResponse.timestamp,
          isImage: aiResponse.isImage,
          imageUrl: aiResponse.imageUrl,
        }

        // Add AI response to chat
        setMessages((prev) => [...prev, assistantMessage])

        // Save assistant message to localStorage
        saveMessageToLocalStorage(characterId, assistantMessage)
        setDebugInfo((prev) => ({ ...prev, lastAction: "aiMessageSaved" }))
      } catch (error) {
        console.error("Error sending message:", error)

        if (!isMounted) return

        setDebugInfo((prev) => ({ ...prev, lastError: error, lastAction: "sendMessageError" }))

        // Add error message
        const errorMessage: Message = {
          id: Math.random().toString(36).substring(2, 15),
          role: "assistant",
          content: "Tyvärr, jag har problem med att ansluta just nu. Försök igen senare.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages((prev) => [...prev, errorMessage])
        saveMessageToLocalStorage(characterId, errorMessage)

        setApiKeyError("Failed to connect to the AI service. Please check your API key configuration.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
  }

  // Clear chat history
  const handleClearChat = () => {
    if (!isMounted) return

    setIsClearingChat(true)
    setDebugInfo((prev) => ({ ...prev, lastAction: "clearingChat" }))

    try {
      const success = clearChatHistoryFromLocalStorage(characterId)
      setDebugInfo((prev) => ({
        ...prev,
        lastAction: success ? "chatCleared" : "chatClearFailed",
      }))

      if (success) {
        // Set default welcome message after clearing
        const welcomeMessage: Message = {
          id: "1",
          role: "assistant",
          content: `Hej där! Jag är ${character.name}. Det är jättekul att träffa dig! Vad heter du?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages([welcomeMessage])

        // Save welcome message to localStorage
        saveMessageToLocalStorage(characterId, welcomeMessage)
      }
    } catch (error) {
      console.error("Error clearing chat:", error)
      setDebugInfo((prev) => ({ ...prev, lastError: error, lastAction: "clearChatError" }))
    } finally {
      if (isMounted) {
        setIsClearingChat(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle clicking on an image
  const handleImageClick = (imageUrl: string) => {
    if (!imageUrl) return

    setSelectedImages([imageUrl])
    setSelectedImageIndex(0)
    setIsImageModalOpen(true)
  }

  // Handle image download
  const handleImageDownload = (imageUrl: string) => {
    // Create a temporary link element
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle image sharing
  const handleImageShare = (imageUrl: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Delad bild",
          text: "Kolla in den här bilden!",
          url: imageUrl,
        })
        .catch((error) => console.log("Error sharing:", error))
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(imageUrl)
        .then(() => alert("Bildlänk kopierad till urklipp!"))
        .catch((err) => console.error("Kunde inte kopiera länk:", err))
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Left Sidebar - Chat List */}
      <div className="hidden md:block md:w-72 border-b md:border-b-0 md:border-r border-border flex flex-col md:h-full h-auto max-h-[40vh] md:max-h-none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Chatta</h1>
          </div>
        </div>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t2("chat.searchForProfile")} className="pl-9 bg-card border-none" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-2 space-y-2">
            {/* Chat List Items - Only show characters with chat history */}
            {characters
              .filter((char) => chatsWithHistory.includes(char.id))
              .map((char) => (
                <Link href={`/chat/${char.id}`} key={char.id} className="block">
                  <div
                    className={`flex items-center p-3 rounded-xl cursor-pointer ${
                      characterId === char.id
                        ? "bg-[#252525] border-2 border-[#00ccff] shadow-md"
                        : "bg-[#f0f0f0] hover:bg-[#e0e0e0] border border-gray-200"
                    }`}
                  >
                    <div className="relative w-12 h-12 mr-3">
                      {/* Use regular img tag for Cloudinary images */}
                      <img
                        src={
                          imageErrors[char.id]
                            ? "/placeholder.svg?height=48&width=48"
                            : char.image || "/placeholder.svg?height=48&width=48"
                        }
                        alt={char.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={() => handleImageError(char.id)}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3
                          className={`font-medium truncate ${characterId === char.id ? "text-white" : "text-gray-900"}`}
                        >
                          {char.name}
                        </h3>
                        <span className={`text-xs ${characterId === char.id ? "text-gray-200" : "text-gray-500"}`}>
                          {(() => {
                            // Get chat history for this character
                            const chatHistory = getChatHistoryFromLocalStorage(char.id)
                            // Return the last message timestamp if available, otherwise use fallback
                            if (chatHistory && chatHistory.length > 0) {
                              const lastMessage = chatHistory[chatHistory.length - 1]
                              return lastMessage.timestamp
                            }
                            return "No messages yet"
                          })()}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${characterId === char.id ? "text-white" : "text-gray-600"}`}>
                        {(() => {
                          // Get chat history for this character
                          const chatHistory = getChatHistoryFromLocalStorage(char.id)
                          // Return the last message content if available, otherwise use fallback text
                          if (chatHistory && chatHistory.length > 0) {
                            const lastMessage = chatHistory[chatHistory.length - 1]
                            return lastMessage.content
                          }
                          return "No messages yet"
                        })()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            {chatsWithHistory.length === 0 && (
              <div className="text-center text-muted-foreground py-4">No chat history yet. Start a new chat!</div>
            )}
          </div>
        </div>
      </div>

      {/* Middle - Chat Area */}
      <div className="flex-1 flex flex-col h-screen md:h-full">
        {/* Chat Header */}
        <div className="fixed top-0 left-0 right-0 h-14 md:static md:h-16 border-b border-border flex items-center px-3 md:px-4 justify-between bg-background shadow-md z-10">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="lg"
              className="mr-2 text-muted-foreground hover:text-foreground md:size-icon p-1 md:p-2"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-6 w-6 md:h-5 md:w-5" />
            </Button>
            <div className="relative w-10 h-10 mr-3">
              {/* Use regular img tag for Cloudinary images */}
              <img
                src={
                  imageErrors["profile"]
                    ? "/placeholder.svg?height=40&width=40"
                    : character?.image || "/placeholder.svg?height=40&width=40"
                }
                alt={character?.name || "Character"}
                className="w-full h-full rounded-full object-cover"
                onError={() => handleImageError("profile")}
                loading="lazy"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="font-medium">{character?.name.split(" ")[0]}</h2>
              <span className="text-xs text-muted-foreground">
                {(() => {
                  // Get chat history for this character
                  const chatHistory = getChatHistoryFromLocalStorage(characterId)
                  // Return the last message timestamp if available, otherwise use fallback
                  if (chatHistory && chatHistory.length > 0) {
                    const lastMessage = chatHistory[chatHistory.length - 1]
                    return lastMessage.timestamp
                  }
                  return "No messages yet"
                })()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClearChatDialog onConfirm={handleClearChat} isClearing={isClearingChat} />
            <PhoneCallDialog character={character} />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-2 md:p-4 space-y-3 md:space-y-4 pt-16 md:pt-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] md:max-w-[70%] ${
                  message.role === "user" ? "bg-[#252525] text-white" : "bg-[#252525] text-white"
                } rounded-2xl p-3`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-current">{message.content}</p>
                </div>
                {message.isImage && message.imageUrl && (
                  <div
                    className="mt-2 relative w-full aspect-square max-w-xs rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(message.imageUrl || "")}
                  >
                    {/* Use regular img tag for generated images */}
                    <img
                      src={imageErrors[message.id] ? "/placeholder.svg" : message.imageUrl}
                      alt="Generated image"
                      className="w-full h-full object-cover rounded-2xl"
                      onError={() => handleImageError(message.id)}
                      loading="lazy"
                    />
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] bg-[#252525] text-white rounded-2xl p-3">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {isGeneratingImage && (
            <div className="flex justify-start">
              <div className="max-w-[70%] bg-[#252525] text-white rounded-2xl p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-foreground">Generating image...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {apiKeyError && (
          <div className="mx-4 p-3 bg-destructive/20 border border-destructive text-destructive-foreground rounded-lg text-sm">
            <p className="font-medium">API Key Error</p>
            <p>{apiKeyError}</p>
            <p className="mt-1">Admin users can set the API key in the Admin Dashboard → API Keys section.</p>
          </div>
        )}

        {/* Chat Input */}
        <div className="fixed bottom-16 left-0 right-0 p-2 md:p-4 border-t border-border bg-background shadow-lg rounded-t-xl md:static md:shadow-none md:rounded-none z-10">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-muted-foreground flex items-center">
              <ImageIcon className="h-3 w-3 mr-1" />
              <TranslatedText text={"Tips: Be mig visa dig en bild eller rita något!"} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Skriv ett meddelande..."
              className="flex-1 bg-card border-border"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading || isGeneratingImage}
            />
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                    disabled={isLoading || isGeneratingImage}
                  >
                    <span className="mr-1">Fråga</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-0 bg-[#1E1E2E] border-[#2A2A3A] text-white"
                  align="end"
                  sideOffset={5}
                >
                  <div className="flex flex-col">
                    <button
                      className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors border-b border-[#2A2A3A]"
                      onClick={() => setInputValue("Visa mig en bild av ")}
                    >
                      Visa mig en bild av...
                    </button>
                    <button
                      className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors border-b border-[#2A2A3A]"
                      onClick={() => setInputValue("Kan du skapa en bild med ")}
                    >
                      Skapa en bild med...
                    </button>
                    <button
                      className="px-4 py-3 text-left hover:bg-[#2A2A3A] transition-colors border-b border-[#2A2A3A]"
                      onClick={() => setInputValue("Kan jag se en bild av ")}
                    >
                      Kan jag se en bild av...
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSendMessage}
                disabled={isLoading || isGeneratingImage || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Profile */}
      <div className="hidden lg:block lg:w-80 border-l border-border">
        <div className="h-full overflow-auto">
          {/* Profile Images Carousel */}
          <div className="relative aspect-square">
            {showVideo ? (
              <div className="w-full h-full">
                {character?.video_url ? (
                  <>
                    <video
                      key={character.video_url}
                      src={character.video_url}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      onError={(e) => {
                        console.error("Video error:", e)
                        alert("Error loading video. See console for details.")
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full bg-black/50 p-2 text-white text-xs">
                      {character.video_url}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-black/20">
                    <p className="text-white bg-black/50 p-2 rounded">No video available</p>
                  </div>
                )}
                <button
                  className="absolute top-2 right-2 bg-background/50 p-1 rounded-full z-10"
                  onClick={() => {
                    console.log("Closing video")
                    setShowVideo(false)
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <>
                {/* Use regular img tag for Cloudinary images */}
                <img
                  src={imageErrors["profile"] ? "/placeholder.svg" : character?.image || "/placeholder.svg"}
                  alt={character?.name || "Character"}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError("profile")}
                  loading="lazy"
                />
                <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 p-1 rounded-full">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 p-1 rounded-full"
                  onClick={() => {
                    console.log("Right chevron clicked")
                    console.log("Character video_url:", character?.video_url)
                    if (character?.video_url) {
                      console.log("Setting showVideo to true")
                      setShowVideo(true)
                    } else {
                      console.log("No video URL available")
                    }
                  }}
                  title={character?.video_url ? "View video introduction" : "No video available"}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-1">{character?.name}</h2>
            <p className="text-muted-foreground mb-4">{character?.description}</p>

            <div className="mb-6">
              <Button
                variant="outline"
                className="w-full bg-[#252525] text-white border-pink-500 hover:bg-[#353535] hover:border-pink-400"
                onClick={() => router.push("/generate")}
              >
                Generate Image
              </Button>
            </div>

            <h3 className="text-lg font-medium mb-4">{t2("chat.aboutMe")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <ProfileDetail icon="🎂" label="AGE" value={character?.age?.toString() || "25"} />
              <ProfileDetail icon="💪" label="BODY" value={character?.body || "Average"} />
              <ProfileDetail icon="🌎" label="ETHNICITY" value={character?.ethnicity || "Mixed"} />
              <ProfileDetail icon="🗣️" label="LANGUAGE" value={character?.language || "English"} />
              <ProfileDetail icon="💑" label="RELATIONSHIP" value={character?.relationship || "Single"} />
              <ProfileDetail icon="💼" label="OCCUPATION" value={character?.occupation || "Student"} />
              <ProfileDetail icon="🎯" label="HOBBIES" value={character?.hobbies || "Reading, Music"} />
              <ProfileDetail icon="😊" label="PERSONALITY" value={character?.personality || "Friendly"} />
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel data={debugInfo} title="Chat Debug Info (localStorage)" />
      <SupabaseDebug />
      {/* Image Modal */}
      <ImageModal
        images={selectedImages}
        initialIndex={selectedImageIndex}
        open={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
        onDownload={handleImageDownload}
        onShare={handleImageShare}
      />
    </div>
  )
}

function ProfileDetail({ icon, label, value }: { icon: string; label: string; value: string }) {
  const { t } = useTranslations()
  return (
    <div className="bg-card p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-xs text-muted-foreground">{t(`profile.${label.toLowerCase()}`)}</span>
      </div>
      <div className="text-sm">{value}</div>
    </div>
  )
}
