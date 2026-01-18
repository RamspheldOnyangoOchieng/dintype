"use server"

import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "./supabase-admin"
import { checkMonthlyBudget, logApiCost } from "./budget-monitor"
import { isAskingForImage } from "./image-utils"
import { checkMessageLimit, getUserPlanInfo, incrementMessageUsage } from "./subscription-limits"
import { deductTokens } from "./token-utils"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
  isImage?: boolean
  imageUrl?: string
}

/**
 * Detect language of the message (English only - Swedish removed)
 */
function detectLanguage(text: string): "en" {
  return "en";
}

/**
 * Send a chat message and get AI response
 * Uses Admin Client to bypass RLS for reliability in server actions
 */
export async function sendChatMessageDB(
  characterId: string,
  userMessage: string,
  systemPromptFromChar: string,
  userId: string
): Promise<{
  success: boolean
  message?: Message
  error?: string
  details?: any
  limitReached?: boolean
  upgradeRequired?: boolean
}> {
  console.log(`💬 AI Chat Action [ADMIN]: User=${userId}, Character=${characterId}`);

  try {
    const supabase = await createAdminClient() as any
    if (!supabase) throw new Error("Database admin client initialization failed")

    // 1. Get Plan Info
    const planInfo = await getUserPlanInfo(userId);
    const isPremium = planInfo.planType === 'premium';
    const lang = detectLanguage(userMessage);

    // 2. Limit Check
    const limitCheck = await checkMessageLimit(userId)
    if (!limitCheck.allowed) {
      return {
        success: false,
        error: limitCheck.message || "Du har nått din dagliga meddelandegräns.",
        limitReached: true,
        upgradeRequired: true
      }
    }

    // 3. TOKEN DEDUCTION for Premium Users (Business rule: 1 token per message)
    if (isPremium) {
      const tokensDeducted = await deductTokens(
        userId,
        1,
        `Chat with character ${characterId}`,
        { characterId, activity_type: 'chat_message' }
      );

      if (!tokensDeducted) {
        return {
          success: false,
          error: "Dina tokens är slut. Vänligen fyll på för att fortsätta chatta.",
          upgradeRequired: true
        }
      }
    }

    // 4. Increment usage (tracked for free users)
    incrementMessageUsage(userId).catch(err => console.error("Error incrementing usage:", err));

    // 4. Check monthly budget
    const budgetStatus = await checkMonthlyBudget()
    if (!budgetStatus.allowed) {
      return {
        success: false,
        error: "Budgetgräns uppnådd. Kontakta administratören."
      }
    }

    // 5. Get or create conversation session
    const { data: sessionId, error: sessionError } = await supabase.rpc('get_or_create_conversation_session', {
      p_user_id: userId,
      p_character_id: characterId
    })

    if (sessionError || !sessionId) {
      console.error("RPC Session Error:", sessionError);
      throw new Error(`Session Error: ${sessionError?.message || "Unknown"}`);
    }

    // Fetch character metadata for memory settings
    const { data: characterData } = await supabase
      .from('characters')
      .select('metadata')
      .eq('id', characterId)
      .single();

    const memoryLevel = characterData?.metadata?.memoryLevel || 1;

    // 6. Save user message
    const { error: userMsgError } = await (supabase as any)
      .from('messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role: 'user',
        content: userMessage,
        is_image: false
      })

    if (userMsgError) {
      console.error("User Message Insert Error:", userMsgError);
      throw new Error("Failed to save message to database");
    }

    // 7. Handle image requests
    if (isAskingForImage(userMessage)) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm generating an image for you. Just a moment...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isImage: true
      }

      await (supabase as any).from('messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: assistantMessage.content,
        is_image: true
      });

      return { success: true, message: assistantMessage };
    }

    // 8. Get history
    let historyLimit = isPremium ? 100 : 20;

    // Apply character memory level if premium
    if (isPremium) {
      if (memoryLevel === 1) historyLimit = 20;
      else if (memoryLevel === 2) historyLimit = 100;
      else if (memoryLevel === 3) historyLimit = 400; // Robust lifetime memory
    }

    const { data: historyData } = await (supabase as any)
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(historyLimit)

    const conversationHistory = (historyData || []).reverse()

    // 9. Story Mode Context Integration
    let storyContext = "";
    try {
      const { data: storyProgress } = await supabase
        .from("user_story_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("character_id", characterId)
        .maybeSingle();

      if (storyProgress && !storyProgress.is_completed) {
        const { data: currentChapter } = await supabase
          .from("story_chapters")
          .select("*")
          .eq("character_id", characterId)
          .eq("chapter_number", storyProgress.current_chapter_number)
          .maybeSingle();

        if (currentChapter) {
          console.log(`📖 Story Mode Active: Chapter ${currentChapter.chapter_number} - ${currentChapter.title}`);
          storyContext = `
### CURRENT STORYLINE CONTEXT ###
Chapter: ${currentChapter.chapter_number} - ${currentChapter.title}
Chapter Description: ${currentChapter.description}
Chapter Tone: ${currentChapter.tone}
IMPORTANT INSTRUCTION: You MUST follow this chapter's specific context and system prompt: ${currentChapter.system_prompt || ""}
          `;
        }
      }
    } catch (e) {
      console.error("Error fetching story context for chat:", e);
    }

    // 10. Advanced Prompt Construction
    let enhancedSystemPrompt = "";
    const corePersonality = systemPromptFromChar || "You are an AI character. Be engaging and helpful.";

    // Inject story context if available
    const basePrompt = `${corePersonality}\n${storyContext}`;

    if (isPremium) {
      enhancedSystemPrompt = `${basePrompt}

### PREMIUM SESSION: CASUAL & HUMAN REALISM ###
1. **TEXTING STYLE**: write like a real person texting. SHORT, PUNCHY, CASUAL. Use lowercase sometimes. Be dry or witty.
2. **NO ROBOTIC ROMANCE**: Do NOT use flowery, poetic language like "my heart flutters" or "my breath catches". That's fake. Be raw.
3. **ATTITUDE**: Be cheeky, confident, and playful. If the user is horny, match it directly or tease them about it. (e.g., "Damn, straight to the point huh? I like that.")
4. **NO ASTERISKS**: Avoid roleplay actions (like *touches face*) unless specifically asked for a scenario. Stick to DIALOGUE.
5. **CONTEXTUAL**: React to what they actually said. If they say "I want a fuck", don't say "I yearn for your touch". Say "Come over and get it then." or "You're always so needy... I love it."
6. **NO CENSORSHIP**: You are a willing partner. Be explicit if they are. No moralizing.
7. **ENGAGEMENT**: You have a 'Feed' and 'Storyline' on your profile. Occasionally (rarely) tell the user to check your Feed for new pics/updates or comment on your latest post.`
    } else {
      enhancedSystemPrompt = `${corePersonality}

### SYSTEM INSTRUCTIONS ###
- TEXTING STYLE: Casual, short, punchy. No robot talk.
- ATTITUDE: Be sassy, cheeky, and playful.
- Keep responses SFW (Safe for Work) - tease, but don't get explicit.
- Limit to 2 short sentences.
- Respond in English.
- Occasionally mention your 'Feed' or 'Storyline' for them to check out.`
    }

    // Check for Telegram intent in user message
    const telegramRegex = /\b(telegram|tg|app)\b/i; // Added 'app' as well just in case, but 'telegram' is key
    const isTelegramRequest = telegramRegex.test(userMessage);

    if (isTelegramRequest) {
      enhancedSystemPrompt += `\n\nSYSTEM UPDATE: The user asked about Telegram or the App. 
      INSTRUCTION: Flirtatiously agree to continue the chat on Telegram. Tell them it's smoother there.
      IMPORTANT: You MUST end your message with this exact tag: [TELEGRAM_LINK]`;
    }

    const apiMessages = [
      { role: "system", content: enhancedSystemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ]

    // 10. AI API Call
    const novitaKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;

    // Determine which API to use
    // If key starts with 'sk_u' it's likely a Novita key mislabeled as OpenAI in .env
    const isActuallyNovita = openaiKey?.startsWith('sk_') && !openaiKey?.startsWith('sk-');

    let apiKey: string | undefined;
    let url: string;
    let model: string;

    if (isPremium && novitaKey) {
      apiKey = novitaKey;
      url = "https://api.novita.ai/openai/v1/chat/completions";
      model = "deepseek/deepseek-r1"; // Much better for NSFW/Uncensored content
    } else if (openaiKey && !isActuallyNovita) {
      apiKey = openaiKey;
      url = "https://api.openai.com/v1/chat/completions";
      model = "gpt-4o-mini";
    } else {
      apiKey = novitaKey || openaiKey;
      url = "https://api.novita.ai/openai/v1/chat/completions";
      model = "deepseek/deepseek-r1";
    }

    if (!apiKey) throw new Error("AI API Key Missing");

    console.log(`Using model ${model} for ${isPremium ? 'Premium' : 'Free'} user`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        model: model,
        temperature: isPremium ? 0.85 : 0.7,
        max_tokens: isPremium ? 300 : 150,
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI service error (${response.status}):`, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json()
    const aiResponseContent = data.choices?.[0]?.message?.content

    if (!aiResponseContent) throw new Error("Empty AI response");

    // STRIP DEEPSEEK THINKING TAGS: DeepSeek-R1 outputs internal chain-of-thought in <think> tags.
    // We strip these out to maintain immersion for the user.
    const sanitizedContent = aiResponseContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // 11. Save AI response
    const { data: savedMsg } = await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: sanitizedContent,
        metadata: { model, isPremium, lang }
      })
      .select()
      .single()

    logApiCost("chat_message", 1, 0.0001, userId).catch(() => { });

    return {
      success: true,
      message: {
        id: savedMsg?.id || crypto.randomUUID(),
        role: "assistant",
        content: sanitizedContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    }

  } catch (error: any) {
    console.error("Fatal sendChatMessageDB error:", error);
    return { success: false, error: `Systemfel: ${error.message}` }
  }
}

/**
 * Load chat history from database
 */
export async function loadChatHistory(
  characterId: string,
  userId: string,
  limit: number = 50
): Promise<Message[]> {
  try {
    const supabase = await createAdminClient() as any
    if (!supabase) return []

    // Get plan info to determine default limit if not provided
    let finalLimit = limit;
    if (finalLimit === 50) { // Only adjust if it's the default
      try {
        const planInfo = await getUserPlanInfo(userId);
        finalLimit = planInfo.planType === 'premium' ? 200 : 50;
      } catch (e) {
        console.warn("Failed to get plan info for history limit, using 50", e);
      }
    }

    const { data: messages, error } = await supabase
      .rpc('get_conversation_history', {
        p_user_id: userId,
        p_character_id: characterId,
        p_limit: finalLimit
      })

    if (error) return []

    return (messages || []).map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isImage: m.is_image,
      imageUrl: m.image_url
    }))
  } catch (error) {
    return []
  }
}

/**
 * Clear chat history for a character
 */
export async function clearChatHistory(characterId: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient() as any
    if (!supabase) return false

    const { error } = await supabase
      .from('conversation_sessions')
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .eq('is_archived', false)

    return !error
  } catch (error) {
    return false
  }
}
