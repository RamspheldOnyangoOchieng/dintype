import { NextRequest, NextResponse } from "next/server"

const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"

export async function POST(req: NextRequest) {
  try {
    const { text, target, source } = await req.json()

    if (!text || !target) {
      return NextResponse.json({ error: "Missing required fields: text, target" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Translate API key not configured" }, { status: 500 })
    }

    // Support both single string and array of strings
    const texts = Array.isArray(text) ? text : [text]

    const body: Record<string, unknown> = { q: texts, target, format: "text" }
    if (source) body.source = source

    const res = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err?.error?.message ?? "Translation failed" }, { status: res.status })
    }

    const data = await res.json()
    const translations: string[] = data.data.translations.map((t: { translatedText: string }) => t.translatedText)

    return NextResponse.json({
      translations,
      // Convenience: if input was a single string, also return as single value
      translatedText: Array.isArray(text) ? undefined : translations[0],
      detectedSourceLanguage: data.data.translations[0]?.detectedSourceLanguage ?? source ?? null,
    })
  } catch (err) {
    console.error("[/api/translate]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Detect language of a given text
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const text = searchParams.get("text")

    if (!text) {
      return NextResponse.json({ error: "Missing query param: text" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Translate API key not configured" }, { status: 500 })
    }

    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err?.error?.message ?? "Detection failed" }, { status: res.status })
    }

    const data = await res.json()
    const detection = data.data.detections[0]?.[0]
    return NextResponse.json({ language: detection?.language ?? null, confidence: detection?.confidence ?? null })
  } catch (err) {
    console.error("[/api/translate GET]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
