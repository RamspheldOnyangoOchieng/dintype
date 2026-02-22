import { Suspense } from "react"
import { createClient } from "@/lib/supabase-server"
import { CharacterGrid } from "@/components/character-grid"
import { ClientChatList } from "@/components/client-chat-list"
import { ChatPageHero, ChatPageRecentHeader, ChatPageDirectoryHeader } from "@/components/chat-page-hero"

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch ALL characters, prioritizing public ones and user's own
  let query = supabase.from("characters").select("*")

  if (user) {
    query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
  } else {
    query = query.eq('is_public', true)
  }

  const { data: rows } = await query.order("created_at", { ascending: false })

  const characters = (rows || []).map((r: any) => {
    let imageUrl = r.image || r.image_url || '';

    // Normalize image URL (handle Supabase storage paths)
    if (imageUrl && !imageUrl.startsWith('http')) {
      const path = imageUrl.startsWith('characters/') ? imageUrl : `characters/${imageUrl}`;
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(path);
      if (publicUrlData?.publicUrl) {
        imageUrl = publicUrlData.publicUrl;
      }
    }

    return {
      id: r.id,
      name: r.name || 'Unnamed',
      age: r.age || 0,
      image: imageUrl,
      description: r.description || '',
      personality: r.personality || '',
      occupation: r.occupation || '',
      hobbies: r.hobbies || '',
      body: r.body || '',
      ethnicity: r.ethnicity || '',
      language: r.language || 'en',
      relationship: r.relationship || '',
      isNew: false,
      createdAt: r.created_at || new Date().toISOString(),
      systemPrompt: r.system_prompt || '',
      category: r.category || 'All',
      videoUrl: r.video_url || undefined,
    }
  })

  return (
    <div className="flex-1 w-full flex flex-col min-h-0 overflow-hidden bg-[#0A0A0A]">
      {/* Cinematic Header Background (Ambient Glow) */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-10 space-y-12 relative scroll-smooth no-scrollbar">

        {/* Hero Section */}
        <ChatPageHero characterCount={characters.length} />

        {/* Recent Conversations Card Container */}
        <section className="relative z-10">
          <ChatPageRecentHeader />
          <div className="bg-[#121212]/50 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl shadow-2xl">
            <ClientChatList />
          </div>
        </section>

        {/* Directory Section */}
        <section className="relative z-10 pb-20">
          <ChatPageDirectoryHeader />

          <div className="min-h-[400px]">
            <Suspense fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2rem]" />
                ))}
              </div>
            }>
              <CharacterGrid characters={characters} />
            </Suspense>
          </div>
        </section>
      </div>

      {/* Modern Scroll Blur Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none z-20" />
    </div>
  )
}
