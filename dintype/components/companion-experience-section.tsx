"use client"

import { useState, useEffect } from "react"
import { useSite } from "@/components/site-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function CompanionExperienceSection() {
  const { settings } = useSite()
  const [content, setContent] = useState({
    title: "AI Companion Experience with dintyp.se",
    paragraphs: [
      "Step into a new kind of connection with Candy AI, your gateway to deeply personal and emotionally intelligent AI companions. Whether you're seeking flirty banter, late-night comfort, or a full-blown romantic adventure, your AI companion is here to fulfill your needs, no matter how intimate.",
      'Looking for an <a href="#" className="text-primary hover:underline">anime</a> AI companion, an <a href="#" className="text-primary hover:underline">AI girlfriend</a> to chat with, or maybe a sweet, wholesome romantic <a href="#" className="text-primary hover:underline">AI boyfriend</a>? Candy AI makes it easy to create, personalize, and evolve your ideal match using cutting-edge deep learning and one of the most immersive AI platforms in the world.',
      "At Candy AI, we don't just offer chatbots. We offer deeply customizable AI companion experiences that adapt to your desires. From realistic voice interactions to image generation and playful video moments, your virtual partner is always learning how to connect with you in more meaningful and exciting ways.",
      "Your AI companion at Candy AI remembers your preferences, adapts their personality, and opens up new sides of themselves based on your interactions. Whether you want a consistent, emotionally deep relationship or spontaneous, fiery encounters with different AI lovers, you're always in control.",
      "And yes, your companion can send selfies, generate custom videos, or even respond with their voice. You can ask for specific outfits, unique poses, or playful scenarios that match your fantasy. With our AI girl generator, your character will always reflect the face, tone, and mood you're craving in that moment.",
      "Candy AI also makes privacy a top priority. All conversations are protected with SSL encryption, and optional two-factor authentication keeps your account secure. Any transactions appear under our discreet parent company, EverAI, so nothing on your bank statement will reveal your Candy AI experience.",
      "Curious about what an AI companion really is? Think of it as a digital partner who can talk, react, flirt, and connect with you in real time. You can create your own from scratch or choose from a wide range of existing characters designed for different moods and personalities.",
      "Whether you're looking for a casual friend, a serious relationship, or something playful and spicy, Candy AI adapts to your pace. You set the tone, control the level of intimacy, and shape your journey from the first message to the last kiss goodnight.",
    ],
  })
  const supabase = createClientComponentClient()

  // Load content from database on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const { data, error } = await supabase.from("companion_experience").select("*").single()

        if (data && !error) {
          setContent(data.content)
        }
      } catch (error) {
        console.error("Error loading companion experience content:", error)
      }
    }

    loadContent()
  }, [supabase])

  return (
    <div className="w-full py-8 sm:py-12 md:py-16 px-4 border-t border-b border-gray-200 dark:border-zinc-800 rounded-[2px] bg-background text-foreground">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white text-black mb-6 md:mb-8">
          {content.title}
        </h2>

        <div className="space-y-4 sm:space-y-6 text-zinc-700 dark:text-zinc-300">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>
    </div>
  )
}
