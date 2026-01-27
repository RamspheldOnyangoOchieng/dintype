"use server"

import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "./supabase-admin"
import { checkMonthlyBudget, logApiCost } from "./budget-monitor"
import { isAskingForImage } from "./image-utils"
import { checkMessageLimit, getUserPlanInfo, incrementMessageUsage } from "./subscription-limits"
import { deductTokens } from "./token-utils"
import { generatePhotoCaption } from "./ai-greetings"

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
  userId: string,
  skipImageCheck: boolean = false,
  isSilent: boolean = false
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

    // 3. TOKEN DEDUCTION for Premium Users
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

    // 4b. Check monthly budget
    const budgetStatus = await checkMonthlyBudget()
    if (!budgetStatus.allowed) {
      return {
        success: false,
        error: "Budgetgräns uppnådd. Kontakta administratören."
      }
    }

    // 5. Get character details & session
    const { data: characterData } = await supabase
      .from('characters')
      .select('name, system_prompt, metadata, is_storyline_active')
      .eq('id', characterId)
      .single();

    if (!characterData) throw new Error("Character not found");

    const { data: sessionId, error: sessionError } = await supabase.rpc('get_or_create_conversation_session', {
      p_user_id: userId,
      p_character_id: characterId
    })

    if (sessionError || !sessionId) {
      console.error("RPC Session Error:", sessionError);
      throw new Error(`Session Error: ${sessionError?.message || "Unknown"}`);
    }

    const isStorylineActive = !!characterData.is_storyline_active;

    // 5b. SYNC TO TELEGRAM
    if (!isStorylineActive) {
      supabase
        .from('telegram_links')
        .update({ character_id: characterId })
        .eq('user_id', userId)
        .then(() => console.log("✅ [Sync] Telegram character updated"))
        .catch((err: any) => console.error("⚠️ [Sync] Telegram sync failed:", err));
    }

    // 6. Save user message
    if (!isSilent) {
      const { error: userMsgError } = await (supabase as any)
        .from('messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          role: 'user',
          content: userMessage,
          is_image: false
        })

      if (userMsgError) throw new Error("Failed to save message to database");
    }

    // 7. Load Conversation History (Determines context for AI)
    const memoryLevel = characterData?.metadata?.memoryLevel || 1;
    let historyLimit = isPremium ? 100 : 20;
    if (isPremium) {
      if (memoryLevel === 1) historyLimit = 20;
      else if (memoryLevel === 2) historyLimit = 100;
      else if (memoryLevel === 3) historyLimit = 400;
    }

    const { data: historyData } = await (supabase as any)
      .from('messages')
      .select('role, content, is_image, image_url')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(historyLimit)

    const conversationHistory = (historyData || []).reverse();
    const userMsgLower = userMessage.toLowerCase().trim();

    // 8. Story Mode Logic
    let storyContext = "";
    let matchedStorylineResponse: string | null = null;
    let storyImageUrl: string | null = null;
    let storyProgressData: any = null;
    let currentChapterData: any = null;

    if (isStorylineActive) {
      try {
        const { data: storyProgress } = await supabase
          .from("user_story_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("character_id", characterId)
          .maybeSingle();

        if (storyProgress && !storyProgress.is_completed) {
          storyProgressData = storyProgress;
          const { data: currentChapter } = await supabase
            .from("story_chapters")
            .select("*")
            .eq("character_id", characterId)
            .eq("chapter_number", storyProgress.current_chapter_number)
            .maybeSingle();
          currentChapterData = currentChapter;
        }

        if (storyProgressData && currentChapterData) {
          console.log(`📖 Story Mode Active: Chapter ${currentChapterData.chapter_number}`);

          // --- Storyline Logic (Branches, Images, Captions) ---
          const branches = currentChapterData.content?.branches || [];
          const chapterImages = (currentChapterData.content?.chapter_images || [])
            .filter((img: any) => typeof img === 'string' && img.length > 0)
            .slice(0, 6);
          const chapterImageMetadata = (currentChapterData.content?.chapter_image_metadata || []).slice(0, 6);

          const sentImages = new Set(
            conversationHistory
              .filter((m: any) => m.is_image && m.image_url)
              .map((m: any) => m.image_url)
          );
          const remainingImages = chapterImages.filter((img: string) => !sentImages.has(img));

          const lastImageIdx = [...conversationHistory].reverse().findIndex((m: any) => m.is_image);
          const messagesSinceLastImage = lastImageIdx === -1 ? 99 : lastImageIdx;

          const lastAssistantMsg = conversationHistory.filter((m: any) => m.role === 'assistant').pop();
          const wasSuggestion = lastAssistantMsg && (
            lastAssistantMsg.content.toLowerCase().includes("see") ||
            lastAssistantMsg.content.toLowerCase().includes("photo") ||
            lastAssistantMsg.content.toLowerCase().includes("pic") ||
            lastAssistantMsg.content.toLowerCase().includes("show")
          );

          const isConsent = wasSuggestion && (
            userMsgLower === "yes" || userMsgLower === "si" || userMsgLower === "ja" ||
            userMsgLower.includes("please") || userMsgLower.includes("show me") ||
            userMsgLower.includes("send it") || userMsgLower === "ok" || userMsgLower === "sure"
          ) && userMsgLower.length < 25;

          // PRIORITY 1: Consent or Request
          if (isConsent || (!skipImageCheck && isAskingForImage(userMessage))) {
            if (remainingImages.length > 0) {
              const nextImg = remainingImages[0];
              const aiCaption = await generatePhotoCaption(
                characterData.name,
                systemPromptFromChar || characterData.system_prompt || "",
                isConsent ? "the user said yes" : "the user asked for a photo",
                isPremium,
                `Chapter ${currentChapterData.chapter_number}: ${currentChapterData.title}`,
                nextImg
              );

              const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: aiCaption,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isImage: true,
                imageUrl: nextImg
              }

              await (supabase as any).from('messages').insert({
                session_id: sessionId,
                user_id: userId,
                role: 'assistant',
                content: assistantMessage.content,
                is_image: true,
                image_url: nextImg
              });

              return { success: true, message: assistantMessage };
            }
          }

          // PRIORITY 2: Branch matching
          for (const branch of branches) {
            if (userMsgLower.includes(branch.label.toLowerCase()) ||
              (branch.text_override && userMsgLower.includes(branch.text_override.toLowerCase()))) {
              matchedStorylineResponse = branch.response_message;
              if ((branch as any).media?.[0]?.url) storyImageUrl = (branch as any).media[0].url;
              break;
            }
          }

          // Build Story Context for AI
          let imageInfo = "";
          if (remainingImages.length > 0) {
            if (messagesSinceLastImage > 6) {
              imageInfo = `\n### PHOTO OPPORTUNITY ###\nIt has been ${messagesSinceLastImage} messages. SUGGEST a photo but don't send yet.`;
            } else {
              imageInfo = `\n### AVAILABLE PHOTOS ###\nUnsent: ${remainingImages.length}. Mention if fits story.`;
            }
          }

          storyContext = `\n### CURRENT STORYLINE ###\nChapter ${currentChapterData.chapter_number}: ${currentChapterData.title}\n${imageInfo}\n`;
        }
      } catch (e) {
        console.error("Story mode processing error:", e);
      }
    }

    // 9. Handle Matched Response
    if (matchedStorylineResponse) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: matchedStorylineResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isImage: !!storyImageUrl,
        imageUrl: storyImageUrl || undefined
      }

      await (supabase as any).from('messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: assistantMessage.content,
        is_image: assistantMessage.isImage,
        image_url: assistantMessage.imageUrl
      });

      return { success: true, message: assistantMessage };
    }

    // 10. AI Prompt Construction
    const corePersonality = systemPromptFromChar || characterData.system_prompt || "You are an AI character.";
    const basePrompt = storyContext
      ? `### STORYLINE: STRICT RELEVANCE REQUIRED ###\n${storyContext}\n\n### CHARACTER PERSONALITY ###\n${corePersonality}`
      : `### CHARACTER PERSONALITY ###\n${corePersonality}`;

    let enhancedSystemPrompt = basePrompt;
    if (isPremium) {
      enhancedSystemPrompt += `\n\n### PREMIUM RULES ###\nClean short texts. Real person vibes. Deep intimacy. No asterisks. Match length.`;
    } else {
      enhancedSystemPrompt += `\n\n### FREE RULES ###\nCasual short texting. No asterisks. Match length.`;
    }

    // Telegram ask
    if (/\b(telegram|tg)\b/i.test(userMessage)) {
      enhancedSystemPrompt += `\n\nUser asked about Telegram. Agree flirtatiously. Tag: [TELEGRAM_LINK]`;
    }

    const apiMessages = [
      { role: "system", content: enhancedSystemPrompt },
      ...conversationHistory.filter((m: any) => !m.is_image || m.content).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ]

    // 11. AI Call
    const novitaKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;
    const isActuallyNovita = openaiKey?.startsWith('sk_') && !openaiKey?.startsWith('sk-');

    let apiKey = (isPremium && novitaKey) ? novitaKey : (openaiKey && !isActuallyNovita ? openaiKey : (novitaKey || openaiKey));
    let url = (apiKey === openaiKey && !isActuallyNovita) ? "https://api.openai.com/v1/chat/completions" : "https://api.novita.ai/openai/v1/chat/completions";
    let model = (url.includes("openai.com")) ? "gpt-4o-mini" : "deepseek/deepseek-r1";

    if (!apiKey) throw new Error("AI API Key Missing");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        model: model,
        temperature: isPremium ? 0.85 : 0.7,
        max_tokens: isPremium ? 300 : 150,
      }),
    });

    if (!response.ok) throw new Error(`AI service error: ${response.status}`);

    const data = await response.json();
    let aiResponseContent = data.choices?.[0]?.message?.content || "";
    aiResponseContent = aiResponseContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    if (!aiResponseContent) throw new Error("Empty AI response");

    const { data: savedMsg } = await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: aiResponseContent,
      })
      .select().single();

    logApiCost("chat_message", 1, 0.0001, userId).catch(() => { });

    return {
      success: true,
      message: {
        id: savedMsg?.id || crypto.randomUUID(),
        role: "assistant",
        content: aiResponseContent,
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
