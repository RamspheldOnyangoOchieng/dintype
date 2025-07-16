import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Store the robots.txt content in the app_settings table
    const supabase = createClient()
    const { error } = await supabase.from("app_settings").upsert({
      id: "robots_txt",
      value: content,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving robots.txt:", error)
      return NextResponse.json({ error: "Failed to save robots.txt" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in robots.txt API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
