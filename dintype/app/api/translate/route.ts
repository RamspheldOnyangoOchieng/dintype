import { type NextRequest, NextResponse } from "next/server"
import { translateText } from "@/lib/translation-service"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = "sv" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const translatedText = await translateText(text, targetLanguage)

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
