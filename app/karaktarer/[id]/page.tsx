"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCharacters } from "@/components/character-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CharacterGallery } from "@/components/character-gallery"
import { CharacterFeed } from "@/components/character-feed"
import { MeetOnTelegramButton } from "@/components/meet-on-telegram-button"
import { TelegramConnectButton } from "@/components/telegram-connect-button"
import { EditCharacterDialog } from "@/components/edit-character-dialog"
import { useAuth } from "@/components/auth-context"
import { Edit, ArrowLeft, Globe, MessageCircle, Send, Sparkles, BookOpen, ImageIcon, User, Activity } from "lucide-react"
import { FEATURES } from "@/lib/features"
import type { Character } from "@/lib/types"

interface CharacterDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const router = useRouter()
  const { characters, isLoading, refreshCharacters } = useCharacters()
  const { user } = useAuth()
  const [characterId, setCharacterId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [displaySettings, setDisplaySettings] = useState<any>({
    show_age: true,
    show_occupation: true,
    show_personality: true,
    show_hobbies: true,
    show_body: true,
    show_ethnicity: true,
    show_language: true,
    show_relationship: true
  })

  // Unwrap params for Next.js 15
  useEffect(() => {
    const unwrap = async () => {
      const p = await params;
      setCharacterId(p.id);
      setIsMounted(true)
    };
    unwrap();
  }, [params])

  // Find character when ID is available
  useEffect(() => {
    if (characterId && !isLoading) {
      const found = characters.find(c => c.id === characterId)
      if (found) {
        setCharacter(found)
        fetchDisplaySettings(characterId)
      } else {
        console.error("Character not found:", characterId)
      }
    }
  }, [characterId, characters, isLoading])

  const fetchDisplaySettings = async (id: string) => {
    try {
      const response = await fetch(`/api/character-display-settings/${id}`)
      if (response.ok) {
        const data = await response.json()
        setDisplaySettings(data)
      }
    } catch (error) {
      console.error("Error fetching display settings:", error)
    }
  }

  if (!isMounted || isLoading || !characterId) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading character...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Character not found</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/karaktarer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to characters
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const telegramLink = `https://t.me/dintypebot?start=char_${character.id?.substring(0, 8)}`

  return (
    <div className="container py-8 max-w-5xl">
      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild className="hover:text-primary pl-0">
            <Link href="/karaktarer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to characters
            </Link>
          </Button>

          {user && character && (user.id === character.user_id || (user as any).isAdmin) && (
            <EditCharacterDialog
              character={character}
              onUpdate={(updated) => {
                setCharacter(updated);
                refreshCharacters();
              }}
            />
          )}
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-start">
          <div className="md:col-span-4 lg:col-span-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl border border-white/5 bg-zinc-900 group">
              {(character.imageUrl || character.image) ? (
                <Image
                  src={character.imageUrl || character.image || "/placeholder.svg"}
                  alt={character.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Ingen bild</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-8 flex flex-col h-full min-h-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight">{character.name}</h1>
                {character.isPublic && (
                  <div className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full flex items-center text-xs font-bold uppercase tracking-wider">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </div>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {character.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {displaySettings.show_personality && character.personality?.split(',').map((trait, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-white/80 border border-white/5">
                    {trait.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-inner mt-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles size={100} />
              </div>
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">{t("characters.startConversation")}</h3>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Button asChild size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/25 border-t border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Link href={`/chatt/${character.id}`}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t("characters.quickFlirt")}
                  </Link>
                </Button>

                {FEATURES.ENABLE_TELEGRAM ? (
                  <MeetOnTelegramButton
                    characterId={character.id}
                    characterName={character.name}
                    variant="outline"
                    className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-14 rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  />
                ) : (
                  <div className="flex-1 h-0 pointer-events-none" />
                )}
              </div>
              {FEATURES.ENABLE_TELEGRAM && (
                <p className="text-center text-[10px] md:text-xs text-white/30 mt-4 font-medium italic">
                  {t("chat.syncMessage") || "Messages sync automatically between platforms 💕"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start h-12 bg-transparent border-b border-white/10 rounded-none p-0 gap-8">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base font-medium text-white/50 hover:text-white/80 transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="story"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base font-medium text-white/50 hover:text-white/80 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Storyline
            </TabsTrigger>
            <TabsTrigger
              value="feed"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base font-medium text-white/50 hover:text-white/80 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base font-medium text-white/50 hover:text-white/80 transition-colors"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-transparent border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  {displaySettings.show_age && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Age</p>
                      <p className="font-bold text-lg">{character.age}</p>
                    </div>
                  )}
                  {displaySettings.show_ethnicity && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Ethnicity</p>
                      <p className="font-bold text-lg capitalize">{character.ethnicity || "-"}</p>
                    </div>
                  )}
                  {displaySettings.show_body && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Body Type</p>
                      <p className="font-bold text-lg capitalize">{character.body || "-"}</p>
                    </div>
                  )}
                  {displaySettings.show_occupation && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Occupation</p>
                      <p className="font-bold text-lg capitalize">{character.occupation || "-"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-transparent border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displaySettings.show_relationship && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Relationship Status</p>
                      <p className="font-bold text-lg capitalize">{character.relationship || "Single"}</p>
                    </div>
                  )}
                  {displaySettings.show_hobbies && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Hobbies</p>
                      <p className="text-base text-white/80">{character.hobbies || "-"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="story" className="mt-8">
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>The Story So Far...</CardTitle>
                  <CardDescription>Dive deeper into {character.name}'s world.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Setting the Scene</h3>
                    <p className="text-white/80 leading-relaxed">
                      {character.story_setting || "No setting information available yet."}
                    </p>
                  </div>

                  <div className="h-px bg-white/10 w-full" />

                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">The Conflict</h3>
                    <p className="text-white/80 leading-relaxed">
                      {character.story_conflict || "No conflict information available yet."}
                    </p>
                  </div>

                  <div className="h-px bg-white/10 w-full" />

                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">The Plot</h3>
                    <p className="text-white/80 leading-relaxed">
                      {character.story_plot || "No plot information available yet."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feed" className="mt-8">
            <CharacterFeed
              characterId={character.id}
              characterName={character.name}
              characterImage={character.imageUrl || character.image}
            />
          </TabsContent>

          <TabsContent value="gallery" className="mt-8">
            <Card className="bg-transparent border-white/10">
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>Unlock exclusive photos from {character.name}'s life.</CardDescription>
              </CardHeader>
              <CardContent>
                <CharacterGallery characterId={character.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
