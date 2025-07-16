import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { CharacterGrid } from "@/components/character-grid"
import { Separator } from "@/components/ui/separator"
import { ClientChatList } from "@/components/client-chat-list"
import { getTranslations } from "@/lib/server-translations"

export default async function ChatPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the language preference from cookies
  const language = cookieStore.get("language")?.value || "en"

  // Get translations for this page
  const t = await getTranslations(language)

  const { data: characters } = await supabase.from("characters").select("*").order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("chat.chats", "Chats")}</h1>
            <p className="text-muted-foreground">
              {t("chat.viewConversationHistory", "View your conversation history with characters.")}
            </p>
          </div>
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("chat.createCharacter", "Create Character")}
            </Button>
          </Link>
        </div>

        <ClientChatList />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("chat.allCharacters", "All Characters")}</h2>
            <Link href="/characters" className="flex items-center text-sm">
              {t("chat.viewAll", "View all")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <Separator />
          <Suspense fallback={<div>{t("chat.loadingCharacters", "Loading characters...")}</div>}>
            <CharacterGrid characters={characters || []} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
