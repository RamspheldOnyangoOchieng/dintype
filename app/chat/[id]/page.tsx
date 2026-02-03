"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Send,
  Menu,
  Loader2,
  User,
  X,
  Wand2,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTranslations } from "@/lib/use-translations"
import { useSidebar } from "@/components/sidebar-context"
import { useCharacters } from "@/components/character-context"
import { sendChatMessage, type Message } from "@/lib/chat-actions"
import { checkNovitaApiKey } from "@/lib/api-key-utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { useAuthModal } from "@/components/auth-modal-context"
import { sendChatMessageDB, loadChatHistory as loadChatHistoryDB, clearChatHistory as clearChatHistoryDB } from "@/lib/chat-actions-db"
import { ClearChatDialog } from "@/components/clear-chat-dialog"
import { checkMessageLimit, incrementMessageUsage, getUserPlanInfo } from "@/lib/subscription-limits"
import { DebugPanel } from "@/components/debug-panel"
import {
  saveMessageToLocalStorage,
  getChatHistoryFromLocalStorage,
  clearChatHistoryFromLocalStorage,
  getRecentConversations,
} from "@/lib/local-storage-chat"
import { saveMessageToDatabase } from "@/lib/chat-storage"
import { SupabaseDebug } from "@/components/supabase-debug"
import { PremiumUpgradeModal } from "@/components/premium-upgrade-modal"
import { isAskingForImage, extractImagePrompt, imageUrlToBase64 } from "@/lib/image-utils"
import { ImageModal } from "@/components/image-modal"
import { CharacterGallery } from "@/components/character-gallery"
import { containsNSFW } from "@/lib/nsfw-filter"
import { TelegramConnectButton } from "@/components/telegram-connect-button"
import { MeetOnTelegramButton } from "@/components/meet-on-telegram-button"
import { WelcomeMessage } from "@/components/welcome-message"
import { toast } from "sonner"
import { ImageGenerationLoading } from "@/components/image-generation-loading"
import { generateDailyGreeting } from "@/lib/ai-greetings"
import { WelcomeModal } from "@/components/welcome-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Trash2, UserCircle, Settings, Info, Share2, MessageCircle, Lock } from "lucide-react"
import { getStoryProgress, getChapter, initializeStoryProgress, completeChapter, type StoryChapter, type UserStoryProgress } from "@/lib/story-mode"
import { Progress } from "@/components/ui/progress"

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const { characters, isLoading: charactersLoading, updateCharacter, refreshCharacters } = useCharacters();
  const [character, setCharacter] = useState<any>(null);
  const [isLookupComplete, setIsLookupComplete] = useState(false);

  // Handle params unwrapping for Next.js 15
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      const newId = resolvedParams.id;
      if (newId !== characterId) {
        setCharacterId(newId);
        setCharacter(null); // Reset character state when navigating to a new ID
        setIsLookupComplete(false); // Reset lookup state
        setMessages([]); // Reset messages when navigating
      }
    };
    unwrapParams();
  }, [params, characterId]);
  const { toggle, setIsOpen } = useSidebar();
  const router = useRouter();
  const { user, isLoading } = useAuth()
  const { openLoginModal } = useAuthModal()
  const { t } = useTranslations()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const processedImageUrlRef = useRef<string | null>(null)

  // Check authentication and show login modal if needed
  useEffect(() => {
    if (!user && !isLoading && characterId) {
      // User is not authenticated, show login modal
      openLoginModal()
    }
  }, [user, isLoading, characterId, openLoginModal])

  // Debug mount
  useEffect(() => {
    console.log("🚀 ChatPage mounted")
    console.log("   - User authenticated:", !!user)
    console.log("   - User ID:", user?.id)
    console.log("   - Character ID:", characterId)
    console.log("   - Window location:", typeof window !== 'undefined' ? window.location.href : 'SSR')
  }, [user, characterId])

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isClearingChat, setIsClearingChat] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string[] | null>(null)
  const [selectedImagePrompt, setSelectedImagePrompt] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)
  const [showTokensDepletedModal, setShowTokensDepletedModal] = useState(false)
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const [chatsWithHistory, setChatsWithHistory] = useState<string[]>([])
  const [showVideo, setShowVideo] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastMessages, setLastMessages] = useState<Record<string, Message | null>>({})
  const [isProfileOpen, setIsProfileOpen] = useState(true)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false)
  const [premiumModalFeature, setPremiumModalFeature] = useState("Message Limit")
  const [premiumModalDescription, setPremiumModalDescription] = useState("Daily message limit reached. Upgrade to premium to continue.")
  const [premiumModalMode, setPremiumModalMode] = useState<'upgrade' | 'message-limit'>('upgrade')
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Story Mode State
  const [storyProgress, setStoryProgress] = useState<UserStoryProgress | null>(null)
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null)
  const [chapterSubProgress, setChapterSubProgress] = useState(0)
  const [sentChapterImages, setSentChapterImages] = useState<string[]>([])
  const sentChapterImagesRef = useRef<string[]>([]) // CRITICAL: Ref for stable closures
  const [chapterMessageCount, setChapterMessageCount] = useState(0)
  const [totalChapters, setTotalChapters] = useState(0)
  const [isLoadingStory, setIsLoadingStory] = useState(false)

  // Use a ref for the interval to ensure we always have the latest reference
  const imageCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Use a ref to track if we're currently processing an image
  const isProcessingImageRef = useRef(false)

  // Use a ref to store the current task ID
  const currentTaskIdRef = useRef<string | null>(null)

  // Track the last loaded character/user combo to prevent redundant reloads
  const lastLoadedIdRef = useRef<string | null>(null)

  // Message aggregation buffer for debouncing (respond once to multiple messages)
  const messageBufferRef = useRef<string[]>([])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isSubmittingRef = useRef(false)

  // Add debug state
  const [debugInfo, setDebugInfo] = useState({
    characterId: characterId,
    messagesCount: 0,
    lastError: null as any,
    lastAction: "none",
    storageType: "localStorage",
  })

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [isGalleryLoading, setIsGalleryLoading] = useState(false)

  // Auto-focus input when AI finish responding or generating image
  useEffect(() => {
    if (!isSendingMessage && !isGeneratingImage && isMounted) {
      // Small delay to ensure the DOM has updated and element is enabled
      const timer = setTimeout(() => {
        if (inputRef.current && !inputRef.current.disabled) {
          inputRef.current.focus();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isSendingMessage, isGeneratingImage, isMounted]);

  const fetchGallery = useCallback(async () => {
    if (!characterId) return
    try {
      setIsGalleryLoading(true)
      const response = await fetch(`/api/gallery?characterId=${characterId}`)
      const data = await response.json()
      if (data.images) {
        setGalleryItems(data.images)
      }
    } catch (error) {
      console.error("Error fetching gallery in ChatPage:", error)
    } finally {
      setIsGalleryLoading(false)
    }
  }, [characterId])

  useEffect(() => {
    if (characterId) {
      fetchGallery()
    }
  }, [characterId, fetchGallery])

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Prepare gallery images
  const galleryImages = useMemo(() => {
    if (!character) return []

    // Start with the main image (always unlocked)
    let imgs = [character.image || "/placeholder.svg"]

    // While gallery is loading, only show the main image to avoid showing locked ones temporarily
    if (isGalleryLoading && galleryItems.length === 0) {
      return imgs
    }

    // Add additional images from the character.images array (legacy/fallback)
    // Only if they aren't explicitly locked in the gallery
    if (character.images && Array.isArray(character.images) && character.images.length > 0) {
      const additional = character.images.filter((img: string) => {
        if (!img || img === character.image) return false

        // Check if this image is in the gallery
        const galleryMatch = galleryItems.find(g =>
          g.imageUrl === img ||
          g.thumbnailUrl === img ||
          (img.includes('cloudinary.com') && g.imageUrl?.includes(img.split('/').pop()?.split('.')[0] || '___'))
        )

        // If it's in the gallery and locked, HIDE it
        if (galleryMatch && galleryMatch.isLocked) return false

        // If it's NOT in the gallery, we'll keep it for now as it might be a public preview image
        // added manually to the character record but not meant to be part of the locked gallery.
        return true
      })
      imgs = [...imgs, ...additional]
    }

    // Add explicitly unlocked images from the gallery that might not be in the character.images array
    const unlockedFromGallery = galleryItems
      .filter(img => !img.isLocked && img.imageUrl)
      .map(img => img.imageUrl)

    imgs = [...imgs, ...unlockedFromGallery]

    // Ensure uniqueness and valid URLs
    return Array.from(new Set(imgs.filter(img => !!img)))
  }, [character, galleryItems, isGalleryLoading])

  const handleNextImage = () => {
    if (galleryImages.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const handlePrevImage = () => {
    if (galleryImages.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCharacter() {
      if (!characterId || characterId === "null") return;
      const charId = String(characterId);
      console.log('🔍 Syncing character details:', charId);

      // 1. Try to find in global characters context (the most up-to-date source)
      const foundInContext = characters.find((char) => char.id === charId);
      if (foundInContext) {
        // Compare current character with context character to avoid infinite loops if using deep objects
        // but simple assignment is usually fine for state updates
        if (JSON.stringify(foundInContext) !== JSON.stringify(character)) {
          console.log("✅ Syncing character from global context:", foundInContext.name);
          if (isMounted) {
            setCharacter(foundInContext);
            setIsLookupComplete(true);
          }
        } else {
          if (isMounted) setIsLookupComplete(true);
        }
        return;
      }

      // 2. Check if this is a custom character
      if (charId.startsWith("custom-")) {
        const customCharacterData = localStorage.getItem(`character-${charId}`);
        if (customCharacterData) {
          try {
            const customChar = JSON.parse(customCharacterData);
            console.log("✅ Loaded custom character from localStorage:", customChar.name);
            if (isMounted) {
              setCharacter(customChar);
              setIsLookupComplete(true);
            }
            return;
          } catch (error) {
            console.error("❌ Error parsing custom character:", error);
          }
        }
      }

      // 3. Fallback: Direct database fetch (using our API for admin overrides)
      console.log("🔎 Character not in context, trying direct fetch...");
      try {
        const response = await fetch(`/api/characters/${charId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch character from API: ${response.status}`)
        }
        const data = await response.json();

        // Type guard using explicit casting if needed, though with select('*') and schema it should be fine.
        const typedData = data as any;

        if (typedData) {
          const char = {
            ...typedData,
            isNew: typedData.is_new,
            createdAt: typedData.created_at,
            systemPrompt: typedData.system_prompt || typedData.systemPrompt,
            image: typedData.image || typedData.image_url,
            imageUrl: typedData.image || typedData.image_url,
            videoUrl: typedData.video_url || typedData.videoUrl,
            isPublic: typedData.is_public || typedData.isPublic,
          };
          console.log("✅ Found character via direct fetch:", char.name);
          if (isMounted) setCharacter(char);
        } else {
          console.error("❌ Character not found in database:", charId);
        }
      } catch (err) {
        console.error("❌ Error fetching character directly:", err);
      } finally {
        if (isMounted) setIsLookupComplete(true);
      }
    }

    loadCharacter();

    return () => {
      isMounted = false;
    };
  }, [characters, charactersLoading, characterId, character]);

  // Automatically close the sidebar on component mount
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Story Mode Effect
  useEffect(() => {
    if (user?.id && characterId) {
      setIsLoadingStory(true)

      const checkTriggerDailyMessage = async (charId: string, chapter: any) => {
        const lastDaily = localStorage.getItem(`last_daily_msg_${charId}`);
        const today = new Date().toDateString();

        if (lastDaily !== today) {
          setIsSendingMessage(true);

          // Enhanced Story Context with Full Chapter Details
          const chapterDetails = chapter ? {
            number: chapter.chapter_number,
            title: chapter.title,
            tone: chapter.tone || "romantic",
            description: chapter.description || "",
            openingMessage: chapter.content?.opening_message || null,
          } : null;

          const storyCtx = chapterDetails
            ? `Storyline Active: Chapter ${chapterDetails.number} - "${chapterDetails.title}". Tone: ${chapterDetails.tone}. ${chapterDetails.description}`
            : "";

          // Sync Ref with current state for daily check
          sentChapterImagesRef.current = sentChapterImages;

          setTimeout(async () => {
            try {
              // 1. Determine Greeting (Prioritize Storyline Opening Message)
              let aiGreeting = "";
              if (chapterDetails?.openingMessage) {
                console.log("📖 Using Storyline Opening Message");
                // Use the Opening Message as the base, but let AI add a personal touch
                aiGreeting = chapterDetails.openingMessage;
              } else {
                aiGreeting = await generateDailyGreeting(
                  charId,
                  character?.name || "Character",
                  character?.system_prompt || character?.systemPrompt || "",
                  user?.id || "",
                  !!user?.isPremium,
                  storyCtx,
                  character?.relationship || "romantic partner"
                );
              }

              const morningMsg: Message = {
                id: `daily-${Date.now()}`,
                role: "assistant",
                content: aiGreeting,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              };

              setMessages(prev => [...prev, morningMsg]);
              saveMessageToLocalStorage(charId, morningMsg);
              saveMessageToDatabase(charId, morningMsg); // Sync to DB
              localStorage.setItem(`last_daily_msg_${charId}`, today);

              // 2. If chapter has images, send one intelligently
              const chImages = (chapter?.content?.chapter_images || []).filter((img: any) =>
                typeof img === 'string' && img.length > 0 && img.startsWith('http')
              );
              const chImagesMeta = (chapter?.content?.chapter_image_metadata || []);

              if (chImages.length > 0) {
                // Pick first unsent image, or fallback to first
                const currentlySent = sentChapterImagesRef.current || [];
                const nextImgIdx = chImages.findIndex((img: string) => !currentlySent.includes(img));
                const selectedIdx = nextImgIdx !== -1 ? nextImgIdx : 0;
                const selectedImg = chImages[selectedIdx];

                const imgMsg: Message = {
                  id: `daily-img-${Date.now()}`,
                  role: "assistant",
                  content: "📷 [Photo]",
                  isImage: true,
                  imageUrl: selectedImg,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };
                setMessages(prev => [...prev, imgMsg]);
                saveMessageToLocalStorage(charId, imgMsg);

                // Update both state and Ref
                const updatedSent = [...new Set([...sentChapterImagesRef.current, selectedImg])];
                sentChapterImagesRef.current = updatedSent;
                setSentChapterImages(updatedSent);

                setChapterSubProgress(prev => Math.min(6, prev + 1));

                // Save image message to DB
                saveMessageToDatabase(charId, imgMsg).catch(err => console.error("Failed to sync daily image to DB:", err));
              }
            } catch (err) {
              console.error("Failed to execute daily AI greeting:", err);
            } finally {
              setIsSendingMessage(false);
            }
          }, 1000);
        }
      };

      const loadStory = async () => {
        if (!characterId || !(character?.is_storyline_active || character?.isStorylineActive)) {
          setIsLoadingStory(false)
          return
        }
        const supabase = createClient()
        try {
          let prog = await getStoryProgress(user.id, characterId)

          if (!prog) {
            const ch1 = await getChapter(characterId, 1)
            if (ch1) {
              prog = await initializeStoryProgress(user.id, characterId)
            }
          }

          if (prog) {
            setStoryProgress(prog)

            // Fetch total chapters count for progress bar
            const { count } = await supabase
              .from("story_chapters")
              .select("*", { count: 'exact', head: true })
              .eq("character_id", characterId);
            setTotalChapters(count || 0);

            if (!prog.is_completed) {
              const ch = await getChapter(characterId, prog.current_chapter_number)
              setCurrentChapter(ch)

              // Calculate initial sub-progress based on history
              const history = await loadChatHistoryDB(characterId, user.id);
              const chImagesSeen = Array.from(new Set(history.filter(m => m.isImage && m.imageUrl).map(m => m.imageUrl))) as string[];

              // Merge with current in-memory sent images to avoid resets
              const mergedSent = [...new Set([...sentChapterImagesRef.current, ...chImagesSeen])];
              sentChapterImagesRef.current = mergedSent;
              setSentChapterImages(mergedSent);
              setChapterSubProgress(Math.min(6, mergedSent.length));
              setChapterMessageCount(history.length);

              // Trigger Daily Message
              checkTriggerDailyMessage(characterId, ch)
            }
          }
        } catch (e) {
          console.error("Story load error", e)
        } finally {
          setIsLoadingStory(false)
        }
      }
      loadStory()
    }
  }, [user, characterId, character])

  // Load characters with chat history (SORTED)
  useEffect(() => {
    if (!isMounted || !user?.id) return

    const loadHistorySync = async () => {
      const supabase = createClient()
      try {
        // 1. Get explicitly ordered recent chats from local storage
        const recentIds = getRecentConversations()

        // 2. Fetch characters with history from Database
        const { data: dbSessions } = await supabase
          .from('conversation_sessions')
          .select('character_id')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('updated_at', { ascending: false });

        const dbCharIds = (dbSessions as any[] || []).map(s => s.character_id);

        // 3. Find any other characters that have local history
        const localCharIds = characters
          .filter((character) => {
            const history = getChatHistoryFromLocalStorage(character.id)
            return history && history.length > 0
          })
          .map((character) => character.id)

        // Combine: Recent first, then DB, then local
        const allIds = Array.from(new Set([...recentIds, ...dbCharIds, ...localCharIds]))

        // Filter out any IDs that don't exist in our characters list anymore
        const validIds = allIds.filter(id => characters.some(c => c.id === id))

        setChatsWithHistory(validIds)
      } catch (error) {
        console.error("Failed to load characters with history:", error)
      }
    }

    loadHistorySync()
  }, [characters, isMounted, messages, user?.id])

  useEffect(() => {
    if (!isMounted || !user?.id) return

    // Proactively check limits for free users on mount/character change
    const preCheckLimits = async () => {
      if (!user.isPremium && !user.isAdmin) {
        try {
          const limitCheck = await checkMessageLimit(user.id)
          if (!limitCheck.allowed) {
            setPremiumModalFeature("Message Limit")
            setPremiumModalDescription("Daily message limit reached. Upgrade to premium to continue chatting unlimited.")
            setPremiumModalMode('message-limit')
            setIsPremiumModalOpen(true)
          }
        } catch (error) {
          console.error("Fast track limit check failed:", error)
        }
      }
    }

    preCheckLimits()
  }, [user, characterId, isMounted])

  useEffect(() => {
    if (!isMounted) return

    const newLastMessages: Record<string, Message | null> = { ...lastMessages }

    // 1. Update from local storage for all characters
    characters.forEach((char) => {
      const history = getChatHistoryFromLocalStorage(char.id)
      if (history && history.length > 0) {
        newLastMessages[char.id] = history[history.length - 1]
      }
    })

    // 2. Override with current chat messages if available
    if (characterId && messages.length > 0) {
      newLastMessages[characterId] = messages[messages.length - 1]
    }

    setLastMessages(newLastMessages)
  }, [characters, isMounted, messages, characterId])

  // Handle redirect to advanced generation page
  const handleAdvancedGenerate = useCallback(() => {
    if (!character) return

    // Build a nice prompt based on character details
    const details = character.metadata?.characterDetails || {
      style: character.category === 'anime' ? 'anime' : 'realistic',
      ethnicity: character.ethnicity,
      age: character.age,
      personality: character.personality,
    }

    const promptBase = `LOCKED FACE: ${character.name}, ${details.age || ''} ${details.ethnicity || ''} ${character.category === 'anime' ? 'anime style' : 'realistic photo'}. ${character.description?.substring(0, 100) || ''}`

    // Check Story Mode lock
    if (storyProgress && !storyProgress.is_completed) {
      toast.error("Complete the storyline to unlock Free Roam image generation!", {
        icon: <Lock className="h-4 w-4" />
      })
      return
    }

    // Redirect to generate page with prompt
    const encodedPrompt = encodeURIComponent(promptBase)
    router.push(`/generate?prompt=${encodedPrompt}&characterId=${character.id}`)
  }, [character, router, storyProgress])

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

  // Load chat history from database (fallback to localStorage if empty/failed)
  const loadChatHistory = useCallback(async () => {
    if (!character || !isMounted || !user?.id) { // Added user?.id check
      console.log("Missing character, user, or component not mounted, skipping chat history load")
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
      console.log("Loading chat history from DB for character:", characterId)

      // 1. Try to get history from Database
      const dbHistory = await loadChatHistoryDB(character.id, user.id) // Pass userId

      if (dbHistory && dbHistory.length > 0) {
        console.log(`Loaded ${dbHistory.length} messages from database`)
        setMessages(dbHistory as any) // Cast to any to match existing Message type
        setIsLoadingHistory(false)
        return
      }

      // 2. Fallback: Get history from localStorage
      console.log("No DB history found, checking localStorage")
      const localHistory = getChatHistoryFromLocalStorage(character.id)

      console.log(`Loaded ${localHistory.length} messages from localStorage`)
      setDebugInfo((prev) => ({
        ...prev,
        messagesCount: localHistory.length,
        lastAction: "historyLoaded",
      }))

      if (localHistory.length > 0) {
        setMessages(localHistory)

        // OPTIONAL: One-time migration to DB could be triggered here
        console.log("Migration candidate: local messages exist but DB is empty")
      } else {
        console.log("No history found anywhere, setting default welcome message")

        // Skip default welcome for storyline characters - they get chapter opening message instead
        if (character?.is_storyline_active || character?.isStorylineActive) {
          console.log("Storyline active, skipping generic welcome");
          setMessages([]);
        } else {
          const defaultMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: `Hey there, my love... 💕 I'm ${character.name}. I've been waiting for someone like you.\n\nSo tell me... what brings you here tonight? You can message me right here, or find me on Telegram @pocketloveaibot for something more... private. 🌹`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isWelcome: true
          }
          setMessages([defaultMessage])
        }
      }
    } catch (error) {
      console.error("Error loading history:", error)
      setDebugInfo((prev) => ({ ...prev, lastError: error, lastAction: "historyError" }))

      // Set default message on error
      setMessages([
        {
          id: `error-welcome-${characterId}`,
          role: "assistant",
          content: `Hey there, my love... 💕 I'm ${character?.name || 'your companion'}. I've been waiting for someone like you. Tell me... what brings you here tonight? 🌹`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isWelcome: true
        },
      ])
    } finally {
      setIsLoadingHistory(false)
    }
  }, [character, characterId, isMounted, user])

  // Effect to load chat history when component mounts or character changes
  useEffect(() => {
    // Only proceed if everything is ready, especially the character object
    if (isMounted && characterId && user?.id && character && character.id === characterId) {
      const currentId = `${user.id}-${characterId}`
      if (lastLoadedIdRef.current !== currentId) {
        console.log("🔄 Loading fresh chat history for:", currentId)
        loadChatHistory()
        lastLoadedIdRef.current = currentId
      }
    }
  }, [loadChatHistory, isMounted, characterId, user?.id, character])

  // Auto-save session management - Enable auto-save when in chat, disable when leaving
  useEffect(() => {
    // Enable auto-save when entering chat
    localStorage.setItem('chat_session_active', 'true')
    localStorage.setItem('chat_auto_save_enabled', 'true')
    console.log('🔵 Chat session started - Auto-save enabled')

    // Cleanup: Disable auto-save when leaving chat
    return () => {
      localStorage.removeItem('chat_session_active')
      localStorage.removeItem('chat_auto_save_enabled')
      console.log('🔴 Chat session ended - Auto-save disabled')
    }
  }, [characterId]) // Re-enable when switching characters

  // Effect to handle images carried from the generation page
  useEffect(() => {
    const imageUrlParam = searchParams.get('imageUrl')
    if (imageUrlParam && characterId && user?.id && !isLoadingHistory && character && character.id === characterId) {
      if (processedImageUrlRef.current !== imageUrlParam) {
        processedImageUrlRef.current = imageUrlParam

        console.log("📸 Image carried to chat:", imageUrlParam)

        // Check if this exact image is already in current local state to avoid duplicates on quick re-renders
        const existsInLocal = messages.some(m => m.imageUrl === imageUrlParam)
        if (existsInLocal) {
          console.log("Image already exists in state, skipping duplicate add.")
          return
        }

        const imageMessage: Message = {
          id: `carried-${Date.now()}`,
          role: "user",
          content: "I love this photo of you! 😍",
          isImage: true,
          imageUrl: imageUrlParam,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages(prev => [...prev, imageMessage])
        saveMessageToLocalStorage(characterId, imageMessage)
        saveMessageToDatabase(characterId, imageMessage)

        // Trigger AI response to the new photo
        setIsSendingMessage(true)
        sendChatMessageDB(
          characterId,
          "I love this photo of you! 😍",
          character.system_prompt || character.systemPrompt || "",
          user.id
        ).then(aiResponse => {
          if (aiResponse.success && aiResponse.message) {
            const assistantMessage: Message = {
              id: aiResponse.message.id,
              role: aiResponse.message.role as any,
              content: aiResponse.message.content,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isImage: aiResponse.message.isImage,
              imageUrl: aiResponse.message.imageUrl,
            }
            setMessages(prev => [...prev, assistantMessage])
            saveMessageToLocalStorage(characterId, assistantMessage)
          }
        }).catch(err => {
          console.error("Error getting AI response for carried image:", err)
        }).finally(() => {
          setIsSendingMessage(false)
        })
      }
    }
  }, [searchParams, characterId, user, isLoadingHistory, character])

  // Add this inside the ChatPage component function, after the other useEffect hooks:
  // Effect to log character data when it changes
  useEffect(() => {
    if (character) {
      console.log("Character data:", {
        id: character.id,
        name: character.name,
        videoUrl: character.videoUrl,
      })
    }
  }, [character])

  // Scroll to bottom when messages load
  useEffect(() => {
    const messagesContainer = document.querySelector('[data-messages-container]')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === "user") {
      const deductToken = async () => {
        if (user) {
          try {
            await fetch("/api/deduct-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: user.id }),
            })
          } catch (error) {
            console.error("Failed to deduct token:", error)
          }
        }
      }
      deductToken()
    }
  }, [messages, user])

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

  // Voice generation removed - will be added to roadmap

  // Function to generate an image
  const generateImage = async (prompt: string) => {
    if (!isMounted) return

    try {
      // If already generating an image, don't start another one
      if (isGeneratingImage) {
        console.log("Already generating an image, ignoring request")
        return
      }

      // Reset processing state
      isProcessingImageRef.current = false
      currentTaskIdRef.current = null

      setIsGeneratingImage(true)

      // Get the character's image URL
      const characterImageUrl = character?.image || "/placeholder.svg"

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
        // Check if auto-save is enabled for the current chat session
        const isChatSessionActive = localStorage.getItem('chat_session_active') === 'true'
        const autoSaveEnabled = localStorage.getItem('chat_auto_save_enabled') === 'true'
        const shouldAutoSave = isChatSessionActive && autoSaveEnabled

        console.log('💾 Auto-save check:', { isChatSessionActive, autoSaveEnabled, shouldAutoSave })

        // Make the API request to the real endpoint
        response = await fetch("/api/img2img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user?.id || "",
          },
          body: JSON.stringify({
            prompt: prompt,
            negativePrompt: "bad quality, worst quality, low quality",
            imageBase64: base64Image,
            character: character,
            autoSave: shouldAutoSave,
          }),
        })

        responseData = await response.json()

        if (response.status === 402) {
          setShowTokensDepletedModal(true)
          setIsGeneratingImage(false)
          return
        }

        if (response.status === 403) {
          setPremiumModalFeature("Premium-bilder")
          setPremiumModalDescription("You need Premium to generate images in chat. Upgrade now to unlock unlimited image generation.")
          setIsPremiumModalOpen(true)
          setIsGeneratingImage(false)
          return
        }

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

      // Check if images were returned directly (Seedream sync success) - skip polling
      if (responseData.images && responseData.images.length > 0 && responseData.status === "TASK_STATUS_SUCCEED") {
        console.log("✅ Images returned directly, skipping polling")
        setGeneratedImageUrl(responseData.images)
        setIsGeneratingImage(false)

        // Add the generated image to the chat
        const imageMessage: Message = {
          id: Math.random().toString(36).substring(2, 15),
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isImage: true,
          imageUrl: Array.isArray(responseData.images) ? responseData.images[0] : responseData.images,
          imagePrompt: prompt,
        }

        setMessages((prev) => [...prev, imageMessage])
        saveMessageToLocalStorage(characterId!, imageMessage)

        // AWAIT these to prevent race conditions during history reloads
        await saveMessageToDatabase(characterId!, imageMessage)
        await handleSaveImage(imageMessage.imageUrl!, imageMessage.imagePrompt, true)

        currentTaskIdRef.current = null
        isProcessingImageRef.current = false
        return
      }

      // Store the task ID for polling
      const newTaskId = responseData.taskId
      currentTaskIdRef.current = newTaskId
      console.log("Image generation started with task ID:", newTaskId)

      // Start polling for results
      const checkEndpoint = useMockApi ? "/api/mock-check-generation" : "/api/check-generation"

      // Instead of using setInterval, we'll use a recursive setTimeout approach
      const checkImageStatus = async () => {
        // If component is unmounted or we're already processing, don't continue
        if (!isMounted || !currentTaskIdRef.current) {
          console.log("Skipping image check - component unmounted or no current task")
          return
        }

        try {
          // Set processing flag to prevent multiple simultaneous checks
          isProcessingImageRef.current = true

          console.log("Checking image status for task:", currentTaskIdRef.current)

          // Check if auto-save is enabled for the current chat session
          const isChatSessionActive = localStorage.getItem('chat_session_active') === 'true'
          const autoSaveEnabled = localStorage.getItem('chat_auto_save_enabled') === 'true'
          const shouldAutoSave = isChatSessionActive && autoSaveEnabled

          // Build query params
          const queryParams = new URLSearchParams({
            taskId: currentTaskIdRef.current,
            autoSave: shouldAutoSave.toString(),
          })

          if (user?.id) queryParams.append('userId', user.id)
          if (characterId) queryParams.append('characterId', characterId)
          if (prompt) queryParams.append('prompt', prompt)

          const pollRes = await fetch(`${checkEndpoint}?${queryParams.toString()}`)
          if (!pollRes.ok) throw new Error("Failed to check image status")

          const data = await pollRes.json()
          console.log("Image status check result:", data.status)

          if (!isMounted) {
            isProcessingImageRef.current = false
            return
          }

          if (data.status === "TASK_STATUS_SUCCEED" && data.images && data.images.length > 0) {
            // Image generation successful
            console.log("Image generation successful")
            setGeneratedImageUrl(data.images)
            setIsGeneratingImage(false)

            // Add the generated image to the chat
            const imageMessage: Message = {
              id: Math.random().toString(36).substring(2, 15),
              role: "assistant",
              content: ".",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isImage: true,
              imageUrl: Array.isArray(data.images) ? data.images[0] : data.images,
              imagePrompt: prompt,
            }

            setMessages((prev) => [...prev, imageMessage])
            saveMessageToLocalStorage(characterId!, imageMessage)

            // AWAIT these to prevent race conditions during history reloads
            await saveMessageToDatabase(characterId!, imageMessage)
            await handleSaveImage(imageMessage.imageUrl!, imageMessage.imagePrompt, true)

            // Get a natural response from the character about the photo
            setTimeout(async () => {
              try {
                console.log("📝 Requesting AI caption for photo...");
                const captionResponse = await fetch("/api/chat/caption", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    characterName: character?.name || "Character",
                    systemPrompt: character?.system_prompt || character?.systemPrompt || "",
                    photoContext: prompt,
                    isPremium: !!user?.isPremium,
                    storyContext: storyProgress && !storyProgress.is_completed ? `We are in Chapter ${storyProgress.current_chapter_number}` : "",
                    imageUrl: imageMessage.imageUrl,
                    relationship: character?.relationship || "romantic partner"
                  })
                });

                let aiCaption = `Here's a little something for you... 😘`;
                if (captionResponse.ok) {
                  const captionData = await captionResponse.json();
                  if (captionData.caption) {
                    aiCaption = captionData.caption;
                  }
                }

                const reactionMsg: Message = {
                  id: `reaction-${Date.now()}`,
                  role: "assistant",
                  content: aiCaption,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };

                setMessages((prev) => [...prev, reactionMsg]);
                saveMessageToLocalStorage(characterId!, reactionMsg);
                await saveMessageToDatabase(characterId!, reactionMsg);
              } catch (err) {
                console.error("Failed to get natural response for photo:", err);
              }
            }, 1000);

            currentTaskIdRef.current = null
            isProcessingImageRef.current = false
            return
          } else if (data.status === "TASK_STATUS_FAILED") {
            console.log("Image generation failed")
            setIsGeneratingImage(false)

            const errorMessage: Message = {
              id: Math.random().toString(36).substring(2, 15),
              role: "assistant",
              content: "Sorry, I couldn't generate that image. Let's try something else.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }

            setMessages((prev) => [...prev, errorMessage])
            saveMessageToLocalStorage(characterId!, errorMessage)
            currentTaskIdRef.current = null
            isProcessingImageRef.current = false
            return
          }

          // Continue polling
          isProcessingImageRef.current = false
          if (currentTaskIdRef.current && isMounted) {
            setTimeout(checkImageStatus, 2000)
          }
        } catch (error) {
          console.error("Error checking image status:", error)
          if (!isMounted) return
          setIsGeneratingImage(false)
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
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "assistant",
        content: "Sorry, I couldn't generate that image. There was a technical issue with the image processing.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
      saveMessageToLocalStorage(characterId!, errorMessage)
    }
  }

  const handleSaveImage = async (imageUrl: string, prompt?: string, isSilent: boolean = false) => {
    if (!user || !characterId) {
      toast.error("You must be logged in to save images")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/save-generated-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          prompt: prompt || `Generated image for ${character?.name || 'character'}`,
          characterId: characterId.startsWith('custom-') ? null : characterId,
          modelUsed: "novita",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save image")
      }

      const result = await response.json()
      if (!isSilent) toast.success("Image saved to your collection and profile!")

      // Special handling for custom characters (localStorage)
      if (characterId.startsWith('custom-') && character) {
        console.log("💾 Updating custom character in localStorage with new image");
        const updatedImages = [...(character.images || []), result.permanentUrl || imageUrl];
        const updatedChar = {
          ...character,
          images: updatedImages
        };

        // Update localStorage
        localStorage.setItem(`character-${characterId}`, JSON.stringify(updatedChar));

        // Update local state to trigger re-render
        setCharacter(updatedChar);
      }

      // Refresh global character data so the carousel updates for DB characters
      if (typeof refreshCharacters === 'function') {
        await refreshCharacters()
      }
    } catch (error) {
      console.error("Error saving image:", error)
      toast.error("Failed to save image")
    } finally {
      setIsSaving(false)
    }
  }

  // Process the accumulated messages in the buffer
  const processMessageBuffer = async () => {
    if (!isMounted || !character || messageBufferRef.current.length === 0) {
      if (isMounted) setIsSendingMessage(false)
      return
    }

    const combinedContent = messageBufferRef.current.join("\n")
    messageBufferRef.current = []

    setDebugInfo((prev) => ({ ...prev, lastAction: "processingBuffer" }))

    try {
      // 1. Check for image requests
      if (isAskingForImage(combinedContent)) {
        if (user?.id && character?.id) {
          saveMessageToDatabase(character.id, {
            id: `user-${Date.now()}`,
            role: "user",
            content: combinedContent,
          }).catch(err => console.error("Error saving trigger message to DB:", err));
        }

        if (storyProgress && !storyProgress.is_completed && (character.is_storyline_active || character.isStorylineActive)) {
          const chImages = (currentChapter?.content?.chapter_images || []).filter((img: any) =>
            typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:'))
          );

          if (chImages.length > 0) {
            const meta = (currentChapter?.content as any)?.chapter_image_metadata || []
            const lowercasePrompt = combinedContent.toLowerCase()
            let bestMatchImg = null

            if (meta.length > 0) {
              for (const imgUrl of chImages) {
                const originalIdx = (currentChapter?.content?.chapter_images || []).indexOf(imgUrl);
                const imgMeta = (meta[originalIdx] || "").toLowerCase();
                if (imgMeta && lowercasePrompt.split(' ').some((word: string) => word.length > 3 && imgMeta.includes(word))) {
                  bestMatchImg = imgUrl;
                  break;
                }
              }
            }

            const nextImg = bestMatchImg || chImages.find((img) => !sentChapterImagesRef.current.includes(img)) || chImages[0]

            const storyImgMsg: Message = {
              id: `story-img-${Date.now()}`,
              role: "assistant",
              content: "📷 [Photo]",
              isImage: true,
              imageUrl: nextImg,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }

            setTimeout(() => {
              setMessages((prev) => [...prev, storyImgMsg])
              saveMessageToLocalStorage(character.id, storyImgMsg)
              saveMessageToDatabase(character.id, storyImgMsg)

              // Update both state and Ref
              const updatedSent = [...new Set([...sentChapterImagesRef.current, nextImg])];
              sentChapterImagesRef.current = updatedSent;
              setSentChapterImages(updatedSent);

              // PROGRESSION CHECK: Triggered after the last chapter image is sent
              const nextMsgCount = chapterMessageCount + 1;
              if (storyProgress && (chImages.length > 0 && updatedSent.length >= chImages.length) || nextMsgCount >= 12) {
                setTimeout(() => {
                  const nextNum = storyProgress.current_chapter_number + 1
                  if (!user?.id) return
                  completeChapter(user.id, character.id, nextNum).then(({ progress, isComplete }) => {
                    if (progress) {
                      setStoryProgress(progress as UserStoryProgress)
                      setSentChapterImages([])
                      sentChapterImagesRef.current = []
                      setChapterMessageCount(0)
                      setChapterSubProgress(0)
                      if (!isComplete) {
                        getChapter(character.id, nextNum).then(ch => {
                          setCurrentChapter(ch)
                          toast.success(`Chapter Completed! Next: ${ch?.title}`)
                          localStorage.removeItem(`last_daily_msg_${character.id}`);
                        })
                      } else {
                        setCurrentChapter(null)
                        toast.success("Storyline Completed! You've unlocked Free Roam.")
                        updateCharacter(character.id, { isStorylineActive: false });
                      }
                    }
                  })
                }, 1000)
              }
            }, 300)

            setIsSendingMessage(false)
            return
          } else {
            const storyRefusalMsg: Message = {
              id: `story-refusal-${Date.now()}`,
              role: "assistant",
              content: "I'm not in the mood for photos right now, let's keep focusing on our time together... 💕",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }

            setTimeout(() => {
              setMessages((prev) => [...prev, storyRefusalMsg])
              saveMessageToLocalStorage(character.id, storyRefusalMsg)
              saveMessageToDatabase(character.id, storyRefusalMsg) // Save refusal to DB
            }, 300)
            setIsSendingMessage(false)
            return
          }
        }

        const imagePrompt = extractImagePrompt(combinedContent)
        setIsSendingMessage(false)
        await generateImage(imagePrompt)
        return
      }

      // 2. Normal Chat Response
      if (!user?.id) {
        toast.error("Please login to continue chatting.")
        openLoginModal()
        setIsSendingMessage(false)
        return
      }

      const aiResponse = await sendChatMessageDB(
        character.id,
        combinedContent,
        character.system_prompt || character.systemPrompt || "",
        user.id,
      )

      if (!aiResponse.success) {
        if (aiResponse.limitReached || aiResponse.upgradeRequired) {
          setPremiumModalFeature(aiResponse.limitReached ? "Message Limit" : "Token Balance")
          setPremiumModalDescription(aiResponse.error || "Upgrade to premium to continue.")
          setPremiumModalMode(aiResponse.limitReached ? "message-limit" : "upgrade")
          setIsPremiumModalOpen(true)
        } else {
          toast.error(aiResponse.error || "Failed to get AI response")
        }
        setIsSendingMessage(false)
        return
      }

      if (aiResponse.message) {
        const assistantMessage: Message = {
          id: aiResponse.message.id,
          role: "assistant",
          content: aiResponse.message.content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isImage: aiResponse.message.isImage,
          imageUrl: aiResponse.message.imageUrl,
        }

        setMessages((prev) => [...prev, assistantMessage])
        saveMessageToLocalStorage(character.id, assistantMessage)

        // If the backend sent an image (story mode), track it
        if (assistantMessage.isImage && assistantMessage.imageUrl) {
          const updatedSent = [...new Set([...sentChapterImagesRef.current, assistantMessage.imageUrl])];
          sentChapterImagesRef.current = updatedSent;
          setSentChapterImages(updatedSent);
        }

        // Narrative Progression
        if (storyProgress && !storyProgress.is_completed && currentChapter && (character.is_storyline_active || character.isStorylineActive)) {
          setChapterMessageCount(prev => prev + 1)
          const chImages = (currentChapter.content?.chapter_images || []).filter((img: any) => typeof img === 'string' && img.length > 0)
          const aiText = aiResponse.message.content.toLowerCase()

          const photoTriggers = ["send you a photo", "sending you a pic", "look at this", "here's a photo", "(image:", "*sends photo*"]
          const shouldSendImage = photoTriggers.some(t => aiText.includes(t)) || aiResponse.message.content.includes("(Image:")

          if (shouldSendImage && chImages.length > 0) {
            const nextImg = chImages.find(img => !sentChapterImagesRef.current.includes(img))
            if (nextImg) {
              const storyImgMsg: Message = {
                id: `story-auto-img-${Date.now()}`,
                role: "assistant",
                content: "📷 [Photo]",
                isImage: true,
                imageUrl: nextImg,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
              setTimeout(() => {
                setMessages(prev => [...prev, storyImgMsg])
                saveMessageToLocalStorage(character.id, storyImgMsg)
                saveMessageToDatabase(character.id, storyImgMsg)

                // Update both state and Ref
                const updatedSent = [...new Set([...sentChapterImagesRef.current, nextImg])];
                sentChapterImagesRef.current = updatedSent;
                setSentChapterImages(updatedSent);
              }, 400)
            }
          }

          // Chapter Completion
          const updatedMessageCount = chapterMessageCount + 1
          const updatedImagesCount = sentChapterImagesRef.current.length; // Use Ref for accuracy
          if ((chImages.length > 0 && updatedImagesCount >= chImages.length) || updatedMessageCount >= 12) {
            setTimeout(() => {
              const nextNum = storyProgress.current_chapter_number + 1
              completeChapter(user.id, character.id, nextNum).then(({ progress, isComplete }) => {
                if (progress) {
                  setStoryProgress(progress as UserStoryProgress)
                  setSentChapterImages([])
                  sentChapterImagesRef.current = []
                  setChapterMessageCount(0)
                  setChapterSubProgress(0)
                  if (!isComplete) {
                    getChapter(character.id, nextNum).then(ch => {
                      setCurrentChapter(ch)
                      toast.success(`Chapter Completed! Next: ${ch?.title}`)
                      localStorage.removeItem(`last_daily_msg_${character.id}`);
                    })
                  } else {
                    setCurrentChapter(null)
                    toast.success("Storyline Completed! You've unlocked Free Roam.")
                    updateCharacter(character.id, { isStorylineActive: false });
                  }
                }
              })
            }, 1000)
          }
        }
      }
    } catch (error) {
      console.error("Error processing messages:", error)
      if (isMounted) toast.error("An error occurred.")
    } finally {
      if (isMounted) setIsSendingMessage(false)
    }
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!isMounted || isSubmittingRef.current) return

    const content = inputValue.trim()
    if (content && !isLoading) {
      isSubmittingRef.current = true
      setInputValue("")
      setIsSendingMessage(true) // Show typing indicator

      // Check message limit before sending
      if (user?.isExpired) {
        setShowExpiredModal(true)
        isSubmittingRef.current = false
        return
      }

      // Pre-check limit (client-side for better UX)
      if (user?.id) {
        try {
          const messageCheck = await checkMessageLimit(user.id)
          if (!messageCheck.allowed) {
            setPremiumModalFeature("Message Limit")
            setPremiumModalDescription(
              "Daily message limit reached. Upgrade to premium to continue chatting unlimited.",
            )
            setPremiumModalMode("message-limit")
            setIsPremiumModalOpen(true)
            setDebugInfo((prev) => ({ ...prev, lastAction: "messageLimitReached" }))
            isSubmittingRef.current = false
            return
          }
        } catch (error) {
          console.error("Error checking message limit:", error)
        }
      }

      if (!character) {
        console.error("Cannot send message: Character is null")
        isSubmittingRef.current = false
        return
      }

      setDebugInfo((prev) => ({ ...prev, messagesCount: prev.messagesCount + 1, lastAction: "sendingMessage" }))

      // Create new user message
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        role: "user",
        content: content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Add user message to chat UI immediately
      setMessages((prev) => [...prev, newMessage])

      // Push content to buffer for AI processing
      messageBufferRef.current.push(content)

      // Save user message locally (for persistence)
      saveMessageToLocalStorage(character.id, newMessage)

      // Debounce the AI processing call (Wait 2s for more messages)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(processMessageBuffer, 500)

      // Release the submission lock after a short delay to prevent double-clicks
      // but allow sending multiple messages quickly.
      setTimeout(() => {
        isSubmittingRef.current = false
      }, 250)
    }
  }

  // Clear chat history
  const handleClearChat = async () => {
    if (!isMounted || !character) return

    setIsClearingChat(true)
    setDebugInfo((prev) => ({ ...prev, lastAction: "clearingChat" }))

    try {
      // 1. Clear local storage
      const localSuccess = clearChatHistoryFromLocalStorage(character.id)

      // 2. Clear database history (archive session)
      const dbSuccess = user?.id ? await clearChatHistoryDB(character.id, user.id) : false

      setDebugInfo((prev) => ({
        ...prev,
        lastAction: (localSuccess || dbSuccess) ? "chatCleared" : "chatClearFailed",
      }))

      if (localSuccess || dbSuccess) {
        // Set default welcome message after clearing
        const welcomeMessage: Message = {
          id: `welcome-${characterId}-${Date.now()}`,
          role: "assistant",
          content: `Hey there... 💕 I'm ${character.name}. Fresh start, huh? I like that.\n\nTell me about yourself... or take me with you on Telegram @pocketloveaibot. Either way, I'm all yours. 🌹`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isWelcome: true
        }

        setMessages([welcomeMessage])
        saveMessageToLocalStorage(characterId!, welcomeMessage)
        toast.success("Chat history cleared.")
      }
    } catch (error) {
      console.error("Error clearing chat:", error)
      setDebugInfo((prev) => ({ ...prev, lastError: error, lastAction: "clearChatError" }))

      // Set default message on error
      setMessages([
        {
          id: `error-welcome-${characterId}`,
          role: "assistant",
          content: `Hey there, my love... 💕 I'm ${character?.name || 'your companion'}. I've been waiting for someone like you. Tell me... what brings you here tonight? 🌹`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isWelcome: true
        },
      ])
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


  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!user) {
    // The useEffect will trigger the login modal
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Please log in to continue...</div>
      </div>
    );
  }

  // Show loading while unwrapping params or loading characters
  const isActuallyMounted = isMounted && characterId !== null;

  // We are loading if:
  // 1. Not mounted yet
  // 2. Context is loading
  // 3. Character is not set AND lookup is NOT complete
  if (!isActuallyMounted || charactersLoading || (!character && !isLookupComplete)) {
    return (
      <div className="flex items-center justify-center h-screen bg-background" key="loading-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-muted-foreground">{t("general.loading")}</div>
        </div>
      </div>
    );
  }

  // Show "not found" ONLY if lookup is complete and no character exists
  if (!character && isLookupComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
        <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md w-full border border-border">
          <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto mb-6">
            <X className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("chat.profileNotFound")}</h1>
          <p className="text-muted-foreground mb-8">Character ID: {characterId}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/chat')} className="w-full">
              {t("chat.backToConversations")}
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              {t("general.home")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      key="chat-page-root"
      className="flex flex-col md:flex-row bg-background w-full overflow-hidden fixed inset-0"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
      suppressHydrationWarning
    >
      {/* Left Sidebar - Chat List - Independent Scroll */}
      <div className="hidden md:flex md:w-72 border-b md:border-b-0 md:border-r border-border flex-col rounded-tr-2xl rounded-br-2xl h-full overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{t("general.chat")}</h1>
          </div>
        </div>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("chat.searchForProfile")} className="pl-9 bg-card border-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-800" style={{ overscrollBehavior: 'contain' }}>
          <div className="p-2 space-y-2">
            {/* Chat List Items - Only show characters with chat history */}
            {chatsWithHistory
              .map((id) => {
                const char = characters.find((c) => c.id === id);
                if (!char) return null;
                return (
                  <Link href={`/chat/${char.id}`} key={char.id} className="block">
                    <div
                      className={`flex items-center p-3 rounded-xl cursor-pointer ${characterId === char.id ? "bg-[#252525] text-white" : "hover:bg-[#252525] hover:text-white"
                        }`}
                    >
                      <div className="relative w-12 h-12 mr-3">
                        {/* Use regular img tag for Cloudinary images */}
                        <img
                          src={
                            imageErrors[char.id]
                              ? "/placeholder.svg?height=48&width=48"
                              : (char.image || char.image_url || "/placeholder.svg?height=48&width=48")
                          }
                          alt={char.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={() => handleImageError(char.id)}
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-foreground truncate">{char.name}</h4>
                          <span className="text-xs text-muted-foreground">
                            {lastMessages[char.id]?.timestamp ?? t("chat.noMessagesYet")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessages[char.id]?.content ?? t("chat.noMessagesYet")}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            {chatsWithHistory.length === 0 && (
              <div className="text-center text-muted-foreground py-4">{t("chat.noConversationsYet")}</div>
            )}
          </div>
        </div>
      </div>

      {/* Middle - Chat Area - Independent Scroll with Fixed Header */}
      <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
        {/* Header & Story Progress - Unified Sticky Area */}
        <div className="flex-shrink-0 z-50 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
          {storyProgress && currentChapter && (
            <div className="px-4 py-3 border-b border-border/50 bg-amber-500/5">
              <div className="flex justify-between items-center mb-2 text-[10px] md:text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    {storyProgress.is_completed ? "Story Completed" : `Chapter ${storyProgress.current_chapter_number} of ${totalChapters || '?'}`}
                  </span>
                  {!storyProgress.is_completed && (
                    <span className="text-foreground/70 font-medium truncate max-w-[120px] md:max-w-[150px]">{currentChapter.title}</span>
                  )}
                </div>
                {!storyProgress.is_completed && (
                  <span className="text-muted-foreground font-mono">
                    {chapterSubProgress}/6 Teasing Images
                  </span>
                )}
              </div>

              {!storyProgress.is_completed && (
                <div className="space-y-1.5 mt-1">
                  {/* Overall Story Progress */}
                  <div className="flex gap-1 h-1">
                    {Array.from({ length: totalChapters || 1 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-500 ${i < (storyProgress?.current_chapter_number || 0) ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-secondary'}`}
                      />
                    ))}
                  </div>

                  {/* Current Chapter Sub-Progress (Teasing) */}
                  <div className="flex gap-0.5 h-0.5 opacity-60">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-500 ${i < chapterSubProgress ? 'bg-amber-400' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Chat Header */}
          <div className="flex items-center px-3 md:px-4 py-3 md:py-4 justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] touch-manipulation"
                onClick={() => toggle()}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] touch-manipulation"
                onClick={() => router.push('/chat')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                {/* Use regular img tag for Cloudinary images */}
                <img
                  src={
                    imageErrors[character?.id || '']
                      ? "/placeholder.svg?height=40&width=40"
                      : (character?.image || character?.image_url || "/placeholder.svg?height=40&width=40")
                  }
                  alt={character?.name || "Character"}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => character?.id && handleImageError(character.id)}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1 overflow-hidden cursor-pointer md:cursor-auto" onClick={() => window.innerWidth < 768 && setIsMobileProfileOpen(true)}>
                <h4 className="font-bold truncate text-foreground leading-tight">
                  {character?.name || t("general.loading")}
                </h4>
                <span className="text-[10px] md:text-xs text-muted-foreground truncate">
                  {isSendingMessage ? (
                    <span className="text-primary animate-pulse font-medium">typing...</span>
                  ) : isGeneratingImage ? (
                    <span className="text-primary animate-pulse font-medium">{character?.name || 'Designing'} is sending photo..</span>
                  ) : (
                    messages.length > 0 ? messages[messages.length - 1].timestamp : t("chat.noMessagesYet")
                  )}
                </span>

              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-1 md:gap-2">
                <ClearChatDialog onConfirm={handleClearChat} isClearing={isClearingChat} />
                {user?.id && character?.id && (
                  <TelegramConnectButton
                    userId={user.id}
                    characterId={character.id}
                    characterName={character.name || 'Companion'}
                    isStoryMode={!!currentChapter}
                    chapter={currentChapter?.chapter_number}
                  />
                )}
              </div>

              {/* Profile Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] touch-manipulation transition-colors",
                  (isProfileOpen || isMobileProfileOpen) && "text-primary"
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileProfileOpen(true)
                  } else {
                    setIsProfileOpen(!isProfileOpen)
                  }
                }}
                title="Profile Details"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Responsive More Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] touch-manipulation">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#252525] text-white min-w-[200px] z-50">
                  <DropdownMenuLabel className="text-xs text-white/40 uppercase tracking-widest font-black py-3 px-4">Chat Options</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#252525]" />

                  {/* Mobile-only Items */}
                  <div className="sm:hidden">
                    <DropdownMenuItem
                      onSelect={() => setIsTelegramModalOpen(true)}
                      className="flex items-center gap-3 py-3 px-4 focus:bg-white/5 cursor-pointer"
                    >
                      <Send className="h-4 w-4 text-primary" />
                      <span>Connect Telegram</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={() => setIsClearDialogOpen(true)}
                      className="flex items-center gap-3 py-3 px-4 text-red-400 focus:text-red-300 focus:bg-red-400/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Clear Chat History</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#252525]" />
                  </div>

                  {/* Profile Toggle for tablets/smaller desktops */}
                  <DropdownMenuItem
                    onSelect={() => setIsProfileOpen(!isProfileOpen)}
                    className="lg:hidden flex items-center gap-3 py-3 px-4 focus:bg-white/5 cursor-pointer"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>{isProfileOpen ? "Hide Profile Details" : "Show Profile Details"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/characters/${character?.id}`} className="flex items-center gap-3 py-3 px-4 focus:bg-white/5 cursor-pointer w-full">
                      <Info className="h-4 w-4" />
                      <span>Character Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-4 focus:bg-white/5 cursor-pointer">
                    <Share2 className="h-4 w-4" />
                    <span>Share Character</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden Dialogs that are triggered by the menu */}
              <div className="hidden">
                <ClearChatDialog
                  onConfirm={handleClearChat}
                  isClearing={isClearingChat}
                  open={isClearDialogOpen}
                  onOpenChange={setIsClearDialogOpen}
                  showTrigger={false}
                />
                {user?.id && character?.id && (
                  <TelegramConnectButton
                    userId={user.id}
                    characterId={character.id}
                    characterName={character.name || 'Companion'}
                    isStoryMode={!!currentChapter}
                    chapter={currentChapter?.chapter_number}
                    open={isTelegramModalOpen}
                    onOpenChange={setIsTelegramModalOpen}
                    showTrigger={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scroll-smooth min-h-0 chat-background" style={{ overscrollBehavior: 'contain' }} data-messages-container>
          {messages.map((message) => (
            <div key={message.id} className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[80%] lg:max-w-[70%] rounded-2xl p-3 md:p-4 shadow-sm transition-all duration-300",
                  message.role === "user"
                    ? "bg-[#252525] text-white rounded-tr-none"
                    : "bg-[#252525] text-white rounded-tl-none border border-white/5"
                )}
              >
                <div className="flex justify-between items-start">
                  {message.isWelcome && character ? (
                    <WelcomeMessage
                      characterName={character.name}
                      characterId={character.id}
                      onStartChat={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input) input.focus();
                      }}
                    />
                  ) : (
                    <>
                      <p className="text-current leading-relaxed break-words whitespace-pre-wrap">
                        {message.content.replace(/\[TELEGRAM_LINK\]/g, '')}
                      </p>
                      {message.content.includes('[TELEGRAM_LINK]') && character && (
                        <div className="mt-3">
                          <MeetOnTelegramButton
                            characterId={character.id}
                            characterName={character.name}
                            isStoryMode={!!currentChapter}
                            chapter={currentChapter?.chapter_number}
                            variant="secondary"
                            className="w-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-blue-500/20"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {message.isImage && message.imageUrl && (
                  <div className="mt-2">
                    <div
                      className="relative w-full aspect-square max-w-xs rounded-2xl overflow-hidden cursor-pointer"
                      onClick={() => {
                        if (message.imageUrl) {
                          const urls = Array.isArray(message.imageUrl) ? message.imageUrl : [message.imageUrl]
                          setSelectedImage(urls)
                          setSelectedImagePrompt(message.imagePrompt || "")
                          setIsModalOpen(true)
                        }
                      }}
                    >
                      <img
                        src={imageErrors[message.id] ? "/placeholder.svg" : (Array.isArray(message.imageUrl) ? message.imageUrl[0] : message.imageUrl)}
                        alt="Generated image"
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '1rem' }}
                        onError={() => handleImageError(message.id)}
                        loading="lazy"
                      />
                    </div>

                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex justify-start mb-4" key="ai-typing-indicator">
              <div className="bg-[#252525] text-white rounded-2xl p-3 border border-white/5 rounded-tl-none">
                <div className="flex space-x-1.5 items-center px-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "200ms", animationDuration: "0.8s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "400ms", animationDuration: "0.8s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {isGeneratingImage && <ImageGenerationLoading characterName={character?.name} />}
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
        <div className="p-3 md:p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="flex items-end gap-2">
            <Input
              ref={inputRef}
              placeholder={t("chat.inputPlaceholder")}
              className="flex-1 bg-card border-border min-h-[44px] text-base md:text-sm resize-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSendingMessage || isGeneratingImage}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck="true"
            />
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px] min-w-[44px] touch-manipulation"
              onClick={handleSendMessage}
              disabled={isSendingMessage || isGeneratingImage || !inputValue.trim() || !character}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Profile - Independent Scroll */}
      <div className={cn(
        "hidden border-l border-border transition-all duration-300 ease-in-out bg-background/50 backdrop-blur-sm h-full",
        isProfileOpen ? "lg:flex lg:flex-col lg:w-80" : "lg:hidden w-0 overflow-hidden"
      )}>
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-800" style={{ overscrollBehavior: 'contain' }}>
          {/* Profile Images Carousel */}
          <div className="relative w-full h-[280px]">
            {showVideo ? (
              <div className="w-full h-full">
                {character?.videoUrl ? (
                  <>
                    <video
                      key={character.videoUrl}
                      src={character.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      onError={(e) => {
                        console.error("Video error:", e)
                        toast.error("Error loading video. See console for details.")
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full bg-black/50 p-2 text-white text-xs">
                      {character.videoUrl}
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
                {/* Carousel Image */}
                <img
                  src={
                    (galleryImages.length > 0
                      ? galleryImages[currentImageIndex]
                      : (character?.image || "/placeholder.svg"))
                  }
                  alt={character?.name || "Character"}
                  className="w-full h-full object-contain bg-background transition-opacity duration-300"
                  onError={() => handleImageError("profile")}
                  loading="lazy"
                />

                {/* Navigation Arrows */}
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Ultra-tiny Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-auto">
                  {galleryImages.map((_, idx) => (
                    <span
                      key={idx}
                      className="cursor-pointer transition-all duration-300"
                      style={{
                        display: 'block',
                        width: '2.5px',
                        height: '2.5px',
                        borderRadius: '50%',
                        padding: '0',
                        margin: '0',
                        backgroundColor: idx === currentImageIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
                        opacity: idx === currentImageIndex ? '1' : '0.6',
                        border: 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                    />
                  ))}
                </div>

                {/* Floating "Watch Video" button if video exists */}
                {character?.videoUrl && (
                  <button
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors backdrop-blur-sm z-10 font-medium"
                    onClick={() => setShowVideo(true)}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Video
                  </button>
                )}
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-4 flex flex-col gap-3">
            <h4 className="text-xl font-bold">{character?.name}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{character?.description}</p>

            {/* Character Gallery */}
            {characterId && (
              <CharacterGallery
                characterId={characterId}
                onImageClick={(url) => {
                  if (url) {
                    setSelectedImage([url])
                    setSelectedImagePrompt("")
                  }
                }}
                onGalleryUpdate={fetchGallery}
              />
            )}

            {/* Generate Image Button - Locked during story mode */}
            {(() => {
              const isLocked = !!(storyProgress && !storyProgress.is_completed);
              return (
                <>
                  <Button
                    className={cn(
                      "w-full border-none font-bold h-12 mt-2 transition-all duration-300",
                      isLocked
                        ? "bg-primary/30 hover:bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                    onClick={handleAdvancedGenerate}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <Lock className="mr-2 h-5 w-5 text-amber-500/80" />
                    ) : (
                      <Wand2 className="mr-2 h-5 w-5" />
                    )}
                    {t("generate.generate")}
                  </Button>
                  {isLocked && (
                    <div className="text-center mt-2 text-xs text-amber-500/80 flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3" /> Image generation locked until story complete
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <Sheet open={isMobileProfileOpen} onOpenChange={setIsMobileProfileOpen}>
        <SheetContent side="right" className="p-0 w-full sm:w-[400px] border-l-border bg-background z-[100]">
          <SheetHeader className="absolute top-2 right-2 z-50">
            <SheetTitle className="sr-only">Profile Details</SheetTitle>
          </SheetHeader>
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-800" style={{ overscrollBehavior: 'contain' }}>
              {/* Profile Images Carousel */}
              <div className="relative w-full h-[350px]">
                {showVideo ? (
                  <div className="w-full h-full">
                    {character?.videoUrl ? (
                      <>
                        <video
                          key={character.videoUrl}
                          src={character.videoUrl}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          onError={(e) => {
                            console.error("Video error:", e)
                            toast.error("Error loading video. See console for details.")
                          }}
                        />
                        <div className="absolute top-0 left-0 w-full bg-black/50 p-2 text-white text-xs">
                          {character.videoUrl}
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
                    {/* Carousel Image */}
                    <img
                      src={
                        (galleryImages.length > 0
                          ? galleryImages[currentImageIndex]
                          : (character?.image || "/placeholder.svg"))
                      }
                      alt={character?.name || "Character"}
                      className="w-full h-full object-cover bg-background transition-opacity duration-300"
                      onError={() => handleImageError("profile")}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />

                    {/* Navigation Arrows */}
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors text-white backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-colors text-white backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Floating "Watch Video" button if video exists */}
                    {character?.videoUrl && (
                      <button
                        className="absolute top-4 right-12 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors backdrop-blur-sm z-10 font-medium"
                        onClick={() => setShowVideo(true)}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Video
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Profile Info - Overlaying the image slightly */}
              <div className="px-5 -mt-20 relative z-10">
                <h4 className="text-3xl font-black text-white mb-2 drop-shadow-md">{character?.name}</h4>
                <div className="w-full h-px bg-white/20 mb-4" />
                <p className="text-gray-200 text-sm leading-relaxed mb-6 drop-shadow-sm font-medium">{character?.description}</p>

                {/* Character Gallery */}
                {characterId && (
                  <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-4 border border-white/5 mb-6">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Gallery</h5>
                    <CharacterGallery
                      characterId={characterId}
                      onImageClick={(url) => {
                        if (url) {
                          setSelectedImage([url])
                          setSelectedImagePrompt("")
                        }
                      }}
                      onGalleryUpdate={fetchGallery}
                    />
                  </div>
                )}

                {/* Mobile Generate Button */}
                {(() => {
                  const isLocked = !!(storyProgress && !storyProgress.is_completed);
                  return (
                    <div className="mb-8 mt-4">
                      <Button
                        className={cn(
                          "w-full border-none font-bold h-12 transition-all duration-300 shadow-lg",
                          isLocked
                            ? "bg-primary/30 hover:bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                        onClick={handleAdvancedGenerate}
                        disabled={isLocked}
                      >
                        {isLocked ? (
                          <Lock className="mr-2 h-5 w-5 text-amber-500/80" />
                        ) : (
                          <Wand2 className="mr-2 h-5 w-5" />
                        )}
                        {t("generate.generate")}
                      </Button>
                      {isLocked && (
                        <div className="text-center mt-3 text-xs text-amber-500/90 flex items-center justify-center gap-1.5 font-medium bg-black/40 py-2 rounded-lg backdrop-blur-sm border border-amber-500/20">
                          <Lock className="h-3.5 w-3.5" /> Image generation locked until story complete
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Debug Panel */}
      <DebugPanel
        characterId={characterId}
        chatId={characterId}
        handleClearChat={handleClearChat}
        handleResetCharacter={() => { }}
        isOpen={false}
      />
      <SupabaseDebug />
      <PremiumUpgradeModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        mode={premiumModalMode}
        feature={premiumModalFeature}
        description={premiumModalDescription}
        imageSrc={character?.image || "https://res.cloudinary.com/ddg02aqiw/image/upload/v1766963040/premium-modals/premium_upgrade.jpg"}
      />

      <PremiumUpgradeModal
        isOpen={showTokensDepletedModal}
        onClose={() => setShowTokensDepletedModal(false)}
        mode="tokens-depleted"
        feature="Tokens Slut"
        description="You have no tokens left. Buy more to generate more images or use premium features."
        imageSrc="https://res.cloudinary.com/ddg02aqiw/image/upload/v1766963046/premium-modals/tokens_depleted.jpg"
      />

      <PremiumUpgradeModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        mode="expired"
        feature="Premium Expired"
        description="Your Premium membership has expired. Renew to continue chatting and creating without limits."
      />

      {
        selectedImage && (
          <ImageModal
            open={!!selectedImage}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedImage(null)
                setSelectedImagePrompt("")
              }
            }}
            images={selectedImage}
            initialIndex={0}
            onDownload={(url, index) => {
              const a = document.createElement('a')
              a.href = url
              a.download = `generated-${index}.jpg`
              a.click()
            }}
            onShare={(url) => {
              navigator.clipboard.writeText(url)
              toast.success("Link copied to clipboard!")
            }}
            onSave={(index) => handleSaveImage(selectedImage[index], selectedImagePrompt)}
            savingIndex={isSaving ? 0 : null} // Simple visual feedback
          />
        )
      }

      {/* Welcome Marketing Modal */}
      <WelcomeModal pageType="chat" />
    </div>
  )
}

function ProfileDetail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-card p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

function translateValue(value: string | undefined): string {
  if (!value) return "";

  const map: Record<string, string> = {
    // Relationships
    "Singel": "Single",
    "Gift": "Married",
    "Dejtar": "Dating",
    "Komplicerat": "Complicated",

    // Body
    "Atletisk": "Athletic",
    "Kurvig": "Curvy",
    "Smal": "Slim",
    "Alldaglig": "Average",
    "Muskulös": "Muscular",

    // Personality
    "Sportig": "Athletic",
    "Lekfull": "Playful",
    "Nyfiken": "Curious",
    "Busig": "Mischievous",
    "Snäll": "Kind",
    "Intelligent": "Intelligent",
    "Rolig": "Funny",
    "Seriös": "Serious",
    "Driven": "Driven",

    // Occupations
    "Universitetsstudent": "University Student",
    "Student": "Student",
    "Lärare": "Teacher",
    "Sjuksköterska": "Nurse",
    "Ingenjör": "Engineer",

    // Ethnicity
    "Vit": "White",
    "Svart": "Black",
    "Asiat": "Asian",
    "Latina": "Latina",
    "Mellanöstern": "Middle Eastern"
  };

  // Helper to translate a single part
  const translateSingle = (part: string) => {
    const trimmed = part.trim();
    if (!trimmed) return part; // Keep whitespace/punctuation

    // Check strict match first
    if (map[trimmed]) return map[trimmed];

    // Check case-insensitive match
    const lowerValue = trimmed.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
      if (k.toLowerCase() === lowerValue) return v;
    }

    return trimmed;
  };

  // If value contains separators, split and map
  if (value.includes('.') || value.includes(',')) {
    // Split by comma or dot, keeping delimiters
    const parts = value.split(/([.,])/);
    return parts.map(part => {
      if (part === '.' || part === ',' || !part.trim()) return part;
      return translateSingle(part);
    }).join('');
  }

  // Fallback for single values
  return translateSingle(value).charAt(0).toUpperCase() + translateSingle(value).slice(1);
}
