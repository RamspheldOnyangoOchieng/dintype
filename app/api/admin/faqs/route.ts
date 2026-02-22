import { NextResponse } from "next/server"
import supabase, { hasSupabaseConfig } from "@/lib/supabase"

// Simple in-memory fallback store (dev only)
let memoryFaqs: { id: string; question: string; answer: string; translations: Record<string, {question:string;answer:string}>; created_at: string }[] = []

export async function GET() {
  // Try DB first if configured
  if (hasSupabaseConfig) {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer, translations, created_at")
        .order("created_at", { ascending: false })
      if (error) throw error
      return NextResponse.json({ data: data || [] })
    } catch (e: any) {
      console.error("FAQs GET error (DB):", e?.message)
    }
  }
  // Fallback to memory
  return NextResponse.json({ data: memoryFaqs })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body?.question || !body?.answer) {
    return NextResponse.json({ error: "Missing question or answer" }, { status: 400 })
  }

  // Accept multilingual translations: { sv: { question, answer }, fr: { ... }, ... }
  const translations = body.translations && typeof body.translations === "object"
    ? body.translations
    : {}

  const payload = {
    id: crypto.randomUUID(),
    question: String(body.question),
    answer: String(body.answer),
    translations,
    created_at: new Date().toISOString(),
  }

  if (hasSupabaseConfig) {
    try {
      const { error } = await supabase.from("faqs").insert([{
        question: payload.question,
        answer: payload.answer,
        translations: payload.translations,
      }])
      if (error) throw error
      return NextResponse.json({ data: payload }, { status: 201 })
    } catch (e: any) {
      console.error("FAQs POST error (DB):", e?.message)
    }
  }
  // Fallback: store in memory
  memoryFaqs.unshift(payload)
  return NextResponse.json({ data: payload }, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body?.id || !body?.translations) {
    return NextResponse.json({ error: "Missing id or translations" }, { status: 400 })
  }

  if (hasSupabaseConfig) {
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ translations: body.translations })
        .eq("id", body.id)
      if (error) throw error
      return NextResponse.json({ success: true })
    } catch (e: any) {
      console.error("FAQs PATCH error (DB):", e?.message)
      return NextResponse.json({ error: e?.message }, { status: 500 })
    }
  }
  // Memory fallback
  const item = memoryFaqs.find(f => f.id === body.id)
  if (item) item.translations = { ...item.translations, ...body.translations }
  return NextResponse.json({ success: true })
}

