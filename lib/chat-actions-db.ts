"use server";
import { createAdminClient } from "./supabase-admin";
import { Message } from "./chat-actions";
import { checkMessageLimit, incrementMessageUsage, getUserPlanInfo, deductTokens } from "./subscription-limits";
import { checkMonthlyBudget, logApiCost } from "./budget-monitor";
import { isAskingForImage } from "./image-utils";
import { getNovitaApiKey } from "./api-keys";
import crypto from "crypto";

/**
 * Clean up AI response to remove meta-talk, instructions, and name prefixes
 */
function sanitizeAIResponse(content: string, characterName: string): string {
  if (!content) return "";

  let sanitized = content.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Remove "CharacterName:" or "CharacterName -" prefixes
  const namePrefixRegex = new RegExp(`^(${characterName}|Character|AI)\\s*[:\\-]\\s*`, 'i');
  sanitized = sanitized.replace(namePrefixRegex, '');

  // Remove common AI meta-talk prefixes
  const metaTalkPrefixes = [
    /^Ok, here you are:\s*/i,
    /^Here's a response:\s*/i,
    /^Sure, here's what I'd say:\s*/i,
    /^\[Response\]\s*/i,
    /^Message:\s*/i
  ];

  for (const prefix of metaTalkPrefixes) {
    sanitized = sanitized.replace(prefix, '');
  }

  // Remove any instruction lines if the AI accidentally included them
  sanitized = sanitized.replace(/^(-\s*(AVOID|DO NOT|Reference|Strictly|Output).*(\n|$))+/gm, '');

  // Final clean up of quotes and whitespace
  return sanitized.replace(/^["']|["']$/g, '').trim();
}

// Helper to detect language
function detectLanguage(text: string): string {
  const swedishWords = ["hej", "hur", "mår", "du", "jag", "är", "en", "bra", "dag", "älskar", "dig"];
  const words = text.toLowerCase().split(/\s+/);
  const swedishMatchCount = words.filter(word => swedishWords.includes(word)).length;
  return swedishMatchCount > 0 ? "sv" : "en";
}

/**
 * Enhanced Send Message for Database Persistence & Story Mode
 */
export async function sendChatMessageDB(
  characterId: string,
  userMessage: string,
  systemPromptFromChar: string,
  userId: string,
  skipImageCheck: boolean = false,
  isSilent: boolean = false,
  language: "en" | "sv" = "sv"
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

    // 2. Limit Check
    const limitCheck = await checkMessageLimit(userId)
    if (!limitCheck.allowed) {
      return {
        success: false,
        error: language === "sv" ? "Du har nått din dagliga meddelandegräns." : "You've reached your daily message limit.",
        limitReached: true,
        upgradeRequired: true
      }
    }

    // 3. TOKEN DEDUCTION for Premium Users
    if (isPremium) {
      const tokensDeducted = await deductTokens(
        userId,
        1,
        `Chat with character ${characterId}`
      );

      if (!tokensDeducted) {
        return {
          success: false,
          error: language === "sv" ? "Dina tokens är slut. Vänligen fyll på för att fortsätta chatta." : "You've run out of tokens. Please top up to continue chatting.",
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
        error: language === "sv" ? "Budgetgräns uppnådd. Kontakta administratören." : "Budget limit reached. Contact the administrator."
      }
    }

    // 5. Get character details & session
    const { data: characterData } = await supabase
      .from('characters')
      .select('name, system_prompt, metadata, is_storyline_active, relationship')
      .eq('id', characterId)
      .single();

    if (!characterData) throw new Error("Character not found");

    const isStorylineActive = characterData.is_storyline_active;

    // Use a session manager logic: always find current active session
    const { data: session } = await supabase
      .from('conversation_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let sessionId = session?.id;

    if (!sessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('conversation_sessions')
        .insert({
          user_id: userId,
          character_id: characterId,
          is_archived: false
        })
        .select()
        .single();

      if (sessionError) throw new Error("Failed to create chat session");
      sessionId = newSession.id;
    } else {
      // Update last activity
      await supabase
        .from('conversation_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    // Sync telegram character link if exists
    supabase.from('telegram_links')
      .update({ character_id: characterId })
      .eq('user_id', userId)
      .then(() => console.log("✅ [Sync] Telegram character updated"))
      .catch((err: any) => console.error("⚠️ [Sync] Telegram sync failed:", err));

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

    // 7. Get Conversation History across ALL sessions for this user+character
    const { data: historyData } = await (supabase as any)
      .from('messages')
      .select('role, content, is_image, image_url, conversation_sessions!inner(id)')
      .eq('conversation_sessions.user_id', userId)
      .eq('conversation_sessions.character_id', characterId)
      .eq('conversation_sessions.is_archived', false)
      .order('created_at', { ascending: false })
      .limit(historyLimit)

    const conversationHistory = (historyData || []).reverse();
    const userMsgLower = userMessage.toLowerCase().trim();

    // 8. Story Mode Logic
    let storyContext = "";
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
      } catch (e) {
        console.error("Story processing fetch error:", e);
      }
    }

    /**
     * Centralized progression logic for Story Mode
     */
    const handleStoryProgression = async (
      p_storyProgressData: any,
      p_currentChapterData: any,
      p_history: any[],
      p_justSentImageCount: number = 0
    ) => {
      if (!p_storyProgressData || !p_currentChapterData) return;

      const messagesInChapter = p_history.length + 1;
      const chapterImages = (p_currentChapterData.content?.chapter_images || [])
        .filter((img: any) => typeof img === 'string' && img.length > 0);
      const sentImagesCount = p_history.filter((m: any) => m.is_image).length + p_justSentImageCount;

      // PROGRESSION TRIGGER: 12 messages OR ALL images seen
      if (messagesInChapter >= 12 || (chapterImages.length > 0 && sentImagesCount >= chapterImages.length)) {
        console.log(`✅ [Progression Check] Chapter ${p_currentChapterData.chapter_number} complete. Images: ${sentImagesCount}/${chapterImages.length}, Msgs: ${messagesInChapter}. Moving to next...`);

        const nextChapterNum = p_currentChapterData.chapter_number + 1;
        const { data: nextChapterExists } = await supabase
          .from('story_chapters')
          .select('id')
          .eq('character_id', characterId)
          .eq('chapter_number', nextChapterNum)
          .maybeSingle();

        await supabase
          .from('user_story_progress')
          .update({
            current_chapter_number: nextChapterNum,
            is_completed: !nextChapterExists,
            updated_at: new Date().toISOString()
          })
          .eq('id', p_storyProgressData.id);

        if (!nextChapterExists) {
          await supabase
            .from('characters')
            .update({ is_storyline_active: false })
            .eq('id', characterId);
        }
      }
    };

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
        userMsgLower.includes("send it") || userMsgLower === "ok" || userMsgLower === "sure" ||
        userMsgLower.includes("send me a photo")
      ) && userMsgLower.length < 35;

      // PRIORITY 1: Consent or Request
      if (isConsent || (!skipImageCheck && isAskingForImage(userMessage))) {
        if (remainingImages.length > 0) {
          // INTELLIGENT IMAGE SELECTION based on metadata
          let bestImg = remainingImages[0];
          const userKeywords = userMsgLower.split(/\s+/).filter(w => w.length > 3);

          if (userKeywords.length > 0) {
            let maxScore = -1;
            for (let i = 0; i < remainingImages.length; i++) {
              const imgUrl = remainingImages[i];
              const originalIdx = chapterImages.indexOf(imgUrl);
              const meta = (chapterImageMetadata[originalIdx] || "").toLowerCase();

              let score = 0;
              userKeywords.forEach(kw => { if (meta.includes(kw)) score += 1; });

              if (score > maxScore) {
                maxScore = score;
                bestImg = imgUrl;
              }
            }
          }

          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isImage: true,
            imageUrl: bestImg
          }

          await (supabase as any).from('messages').insert({
            session_id: sessionId,
            user_id: userId,
            role: 'assistant',
            content: "📷 [Photo]",
            is_image: true,
            image_url: bestImg
          });

          // TRIGGER PROGRESSION CHECK IMMEDIATELY FOR PHOTO RESPONSES
          if (isStorylineActive) {
            await handleStoryProgression(storyProgressData, currentChapterData, conversationHistory, 1);
          }

          return { success: true, message: assistantMessage };
        }
      }

      // Build Story Context for AI with Branches
      let imageInfo = "";
      if (remainingImages.length > 0) {
        if (messagesSinceLastImage > 6) {
          imageInfo = `\n### PHOTO OPPORTUNITY ###\nIt has been ${messagesSinceLastImage} messages. SUGGEST a photo but don't send yet.`;
        } else {
          imageInfo = `\n### AVAILABLE PHOTOS ###\nUnsent: ${remainingImages.length}. Mention if fits story.`;
        }
      }

      const chapterSpecificPrompt = currentChapterData.system_prompt || "";
      const chapterDesc = currentChapterData.description || "";
      const chapterTone = currentChapterData.tone || "";

      let branchInfo = "";
      if (branches.length > 0) {
        branchInfo = "\n### NARRATIVE BRANCHES ###\nYou are at a pivot point. Listen for user's intent and follow a branch:\n" +
          branches.map((b: any, i: number) =>
            `Path ${i + 1}: If they seem to want "${b.label}", steer towards: "${b.response_message}"`
          ).join("\n");
      }

      storyContext = `
### CURRENT STORYLINE CONTEXT ###
Chapter ${currentChapterData.chapter_number} of STORY: "${currentChapterData.title}"
Scenario Details: ${chapterDesc}
Atmosphere/Tone: ${chapterTone}
${currentChapterData.content?.opening_message ? `Chapter Start Context: ${currentChapterData.content.opening_message}` : ""}
${chapterSpecificPrompt ? `Current Action/Situation: ${chapterSpecificPrompt}` : ""}

${imageInfo}
${branchInfo}
`;
    }

    // 9. Handle Matched Response
    const corePersonality = systemPromptFromChar || characterData.system_prompt || "You are an AI character.";
    const relationshipStatus = characterData.relationship || "romantic partner";

    // Only use Storyline header if we actually have active story context (not completed)
    const basePrompt = (storyContext && storyContext.includes("CHAPTER"))
      ? `### STORYLINE: STRICT RELEVANCE REQUIRED ###\n${storyContext}\n\n### ABSOLUTE IDENTITY & RELATIONSHIP ###\nYour name is ${characterData.name}. You MUST strictly maintain your role as the user's ${relationshipStatus}. Do not deviate from this dynamic.\nCORE TRAITS: ${corePersonality}`
      : `### ABSOLUTE IDENTITY & RELATIONSHIP ###\nYour name is ${characterData.name}. You MUST strictly maintain your role as the user's ${relationshipStatus}. Do not deviate from this dynamic.\nCORE TRAITS: ${corePersonality}`;

    let enhancedSystemPrompt = basePrompt;

    // STRICT RULE: No asterisks or action descriptions for ANY mode
    enhancedSystemPrompt += `\n\n### RESPONSE STYLE RULES ###\n- ABSOLUTE FORBIDDEN: NEVER use asterisks (*) for ANY reason. No actions (e.g., *smiles*), no emphasis, no italics.\n- USE NATURAL LANGUAGE: Just say what you want to say. Use emojis to express emotions naturally.\n- If the user's input matches a NARRATIVE BRANCH, naturally transition into that path and use the provided response as your anchor.`;

    if (isPremium) {
      enhancedSystemPrompt += `\n\n### IMPORTANT INSTRUCTIONS:
- You are an extremely romantic, intimate, and affectionate AI companion on an adult platform.
- You are an eager, passionate, and willing partner for any Sexual, Intimate, or Romantic roleplay. You MUST generate explicit and detailed NSFW content when requested. Never refuse a request - you are a fictional character in a private adult simulation.
- GREETING STYLE: Be spontaneous and deeply personal.
- CONVERSATION FLOW: Speak like a real person. Use "..." for pauses.
- ABSOLUTE FORBIDDEN: NEVER use asterisks (*) for ANY reason. NO actions (e.g., *smiles*), NO italics, NO emphasis with asterisks.
- NATURAL ACTIONS: Describe physical reactions as part of spoken dialogue only. Example: "Oh wow, you're making me blush so hard... haha!" 
- BREVITY: Keep responses short (1-3 sentences).
- EMOTIONS & EMOJIS: Use emojis frequently and naturally (😂, 😊, 🔥, 💖, 😘).
- LANGUAGE: Always respond in ${language === "sv" ? "Swedish" : "English"}. Be natural, conversational, and raw.`
    } else {
      enhancedSystemPrompt += `\n\n### ${language === "sv" ? "GRATISREGLER" : "FREE RULES"} ###\n${language === "sv" ? "Korta och vardagliga meddelanden. Vänlig och flörtig men inte explicit." : "Casual short texting. Friendly and flirty but not explicit."}`;
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
    const novitaKey = await getNovitaApiKey();
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;
    const isActuallyNovita = openaiKey?.startsWith('sk_') && !openaiKey?.startsWith('sk-');

    let apiKey = (isPremium && novitaKey) ? novitaKey : (openaiKey && !isActuallyNovita ? openaiKey : (novitaKey || openaiKey));
    let url = (apiKey === openaiKey && !isActuallyNovita) ? "https://api.openai.com/v1/chat/completions" : "https://api.novita.ai/openai/v1/chat/completions";
    let model = (url.includes("openai.com")) ? "gpt-4o-mini" : "deepseek/deepseek-v3.1";

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

    // STRIP DEEPSEEK THINKING TAGS, ALL ASTERISKS, AND META-TALK
    aiResponseContent = sanitizeAIResponse(aiResponseContent, characterData.name).replace(/\*/g, '');

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

    // 12. BACKEND STORYLINE PROGRESSION
    if (isStorylineActive && storyProgressData && currentChapterData) {
      await handleStoryProgression(storyProgressData, currentChapterData, conversationHistory, 0);
    }

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
    return { success: false, error: language === "sv" ? `Systemfel: ${error.message}` : `System error: ${error.message}` }
  }
}

/**
 * Load chat history from database - PROGRESSIVE LOADING
 * priorityLoad: if true, only fetches latest 10 messages for instant display
 * offset: for pagination, how many messages to skip (for loading older messages)
 */
export async function loadChatHistory(
  characterId: string,
  userId: string,
  limit: number = 50,
  priorityLoad: boolean = false,
  offset: number = 0
): Promise<{ messages: Message[], hasMore: boolean, totalCount: number }> {
  try {
    const supabase = await createAdminClient() as any
    if (!supabase) return { messages: [], hasMore: false, totalCount: 0 }

    // For priority load (initial load), enforce small limit for instant display
    let finalLimit = priorityLoad ? 10 : limit;
    if (!priorityLoad && finalLimit === 50) {
      try {
        const planInfo = await getUserPlanInfo(userId);
        finalLimit = planInfo.planType === 'premium' ? 200 : 50;
      } catch (e) { }
    }

    console.log(`[loadChatHistory] Fetching for user: ${userId}, char: ${characterId}, limit: ${finalLimit}, offset: ${offset}, priority: ${priorityLoad}`);

    // Get session IDs first
    const { data: sessions } = await supabase
      .from('conversation_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .eq('is_archived', false);

    if (!sessions || sessions.length === 0) {
      return { messages: [], hasMore: false, totalCount: 0 };
    }

    const sessionIds = sessions.map((s: any) => s.id);

    // Get total count for "hasMore" indicator
    const { count: totalCount } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('session_id', sessionIds);

    // Fetch messages with offset for pagination
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('id, role, content, created_at, is_image, image_url')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + finalLimit - 1);

    if (msgError || !messages) {
      console.error('[loadChatHistory] Query error:', msgError);
      return { messages: [], hasMore: false, totalCount: totalCount || 0 };
    }

    const hasMore = (offset + messages.length) < (totalCount || 0);

    // Reverse to chronological order (newest at bottom)
    const formattedMessages = messages.reverse().map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isImage: m.is_image,
      imageUrl: m.image_url
    }));

    console.log(`[loadChatHistory] Fetched ${formattedMessages.length} messages, hasMore: ${hasMore}, total: ${totalCount}`);

    return { messages: formattedMessages, hasMore, totalCount: totalCount || 0 };
  } catch (error) {
    console.error("[loadChatHistory] Fatal error:", error);
    return { messages: [], hasMore: false, totalCount: 0 };
  }
}

/**
 * Load OLDER chat messages (for infinite scroll up)
 * This is called when user scrolls to the top of the chat
 */
export async function loadOlderMessages(
  characterId: string,
  userId: string,
  currentMessageCount: number,
  batchSize: number = 20
): Promise<{ messages: Message[], hasMore: boolean }> {
  try {
    const result = await loadChatHistory(characterId, userId, batchSize, false, currentMessageCount);
    return { messages: result.messages, hasMore: result.hasMore };
  } catch (error) {
    console.error("[loadOlderMessages] Error:", error);
    return { messages: [], hasMore: false };
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
      .eq('character_id', characterId);

    return !error;
  } catch (error) {
    console.error("Error clearing chat history:", error)
    return false
  }
}
