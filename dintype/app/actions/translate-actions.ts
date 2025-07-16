"use server"

import { translateText } from "@/lib/translation-service"
import { cookies } from "next/headers"

export async function translateServerContent(text: string): Promise<string> {
  const cookieStore = cookies()
  const language = cookieStore.get("language")?.value || "en"

  if (language === "en") {
    return text
  }

  try {
    return await translateText(text, language)
  } catch (error) {
    console.error("Server translation error:", error)
    return text
  }
}
