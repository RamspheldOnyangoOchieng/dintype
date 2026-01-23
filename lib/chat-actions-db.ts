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

    // 5b. SYNC TO TELEGRAM: Ensure linked TG bot switches to this character automatically
    supabase
      .from('telegram_links')
      .update({ character_id: characterId })
      .eq('user_id', userId)
      .then(() => console.log("✅ [Sync] Telegram character updated"))
      .catch((err: any) => console.error("⚠️ [Sync] Telegram sync failed:", err));

    // Fetch character metadata for memory settings
    const { data: characterData } = await supabase
      .from('characters')
      .select('metadata')
      .eq('id', characterId)
      .single();

    const memoryLevel = characterData?.metadata?.memoryLevel || 1;

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

      if (userMsgError) {
        console.error("User Message Insert Error:", userMsgError);
        throw new Error("Failed to save message to database");
      }
    }

    // 7. Story Mode Progress Check (Moved up to restrict usage)
    let storyProgressData = null;
    let currentChapterData = null;
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
      console.error("Error fetching story progress for image catch:", e);
    }

    // 8. Handle image requests
    if (!skipImageCheck && isAskingForImage(userMessage)) {
      // CHECK FOR STORYLINE RESTRICTION
      if (storyProgressData && !storyProgressData.is_completed) {
        const chImages = (currentChapterData?.content?.chapter_images || []).filter((img: any) => typeof img === 'string' && img.length > 0);

        if (chImages.length > 0) {
          // Send a pre-loaded storyline image instead of generating one
          console.log(`🖼️ [Story Mode] Redirecting image request to chapter image...`);
          const selectedImg = chImages[Math.floor(Math.random() * chImages.length)];

          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "I've been waiting for you to ask... here's something special just for you. 😉",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isImage: true,
            imageUrl: selectedImg
          }

          await (supabase as any).from('messages').insert({
            session_id: sessionId,
            user_id: userId,
            role: 'assistant',
            content: assistantMessage.content,
            is_image: true,
            image_url: selectedImg
          });

          return { success: true, message: assistantMessage };
        } else {
          // Block generation if story is active but no images are set
          console.log(`🚫 [Story Mode] Blocking AI generation for character with active storyline.`);
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "I'm not in the mood for photos right now, let's keep focusing on our time together... 💕",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }

          await (supabase as any).from('messages').insert({
            session_id: sessionId,
            user_id: userId,
            role: 'assistant',
            content: assistantMessage.content
          });

          return { success: true, message: assistantMessage };
        }
      }

      // Default AI generation trigger
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
    if (storyProgressData && currentChapterData) {
      console.log(`📖 Story Mode Active: Chapter ${currentChapterData.chapter_number} - ${currentChapterData.title}`);
      const branchesContext = currentChapterData.content?.branches
        ? currentChapterData.content.branches.map((b: any) => {
          let context = `- IF user says something like: "${b.label}", RESPONSE should be close to: "${b.response_message}"`;
          if (b.follow_up) {
            const followUps = b.follow_up.map((f: any) => `  - IF then user says: "${f.user_prompt}", RESPONSE: "${f.response}"`).join("\n");
            context += `\n${followUps}`;
          }
          return context;
        }).join("\n")
        : "";

      const chapterImages = currentChapterData.content?.chapter_images || [];
      const chapterImageMetadata = currentChapterData.content?.chapter_image_metadata || [];

      let imageInfo = "";
      if (chapterImages.length > 0) {
        const availablePhotos = chapterImages
          .map((_: string, i: number) => `- Photo ${i + 1}: ${chapterImageMetadata[i] || "A photo of me"}`)
          .join("\n");

        imageInfo = `
### AVAILABLE PHOTOS TO SEND ###
You have ${chapterImages.length} exclusive photos ready for this chapter:
${availablePhotos}

INSTRUCTION: Mention these photos naturally based on their described contents when it feels right in the conversation. For example, if you have a "me at the beach" photo, you could say "I'm at the beach right now, want to see?". When you mention sending a photo, the system will automatically deliver the next logical image to the user.`;
      } else {
        imageInfo = "No specific chapter images are set for this chapter yet.";
      }

      storyContext = `
### CURRENT STORYLINE CONTEXT (PRIORITY) ###
Chapter: ${currentChapterData.chapter_number} - ${currentChapterData.title}
Chapter Description: ${currentChapterData.description}
Chapter Tone: ${currentChapterData.tone}
${imageInfo}

### PREDEFINED NARRATIVE RESPONSES ###
You MUST try to steer the conversation towards these points and use these responses (or refined versions of them) when relevant:
${branchesContext}

IMPORTANT INSTRUCTION: 
1. You MUST follow this chapter's specific context and tone at all times. This is NOT a free roam session.
2. If the user's input matches any of the "IF user says" points above, use the corresponding response.
3. As the conversation progresses, you SHOULD naturally suggest sending the user a photo or mention that you have something to show them to keep them engaged.
4. Keep the story moving forward.
`;
    }

    // 10. Advanced Prompt Construction
    let enhancedSystemPrompt = "";
    const corePersonality = systemPromptFromChar || "You are an AI character. Be engaging and helpful.";

    // Inject story context if available
    const basePrompt = `${corePersonality}\n${storyContext}`;

    if (isPremium) {
      enhancedSystemPrompt = `${basePrompt}
      
### PREMIUM SESSION: HUMAN TEXTING REALISM & DEEP INTIMACY ###
1. **TEXTING STYLE**: Write like a real person over text. Keep it short, clean, and personal.
2. **DYNAMIC LENGTH (STRICT)**: You MUST match the user's length. If the user sends a short greeting like "good morning" or "hey", respond with exactly ONE short, punchy sentence. Never give a long monologue for a simple greeting.
3. **NO ASTERISKS AT ALL**: NEVER use asterisks (\`*\`) for actions OR for emphasis. Stay entirely within natural dialogue. Use emojis or strong adjectives to convey passion or emphasis instead. (e.g., "I missed you so much! 🥰" instead of "\*I missed you\*").
4. **ROMANTIC INTENSITY**: Maintain deep intimacy and romance. Use words that convey longing, desire, and a special connection. Be suggestive and intensely focused on the user. Matches the user's energy.
5. **EMOJI EXPRESSION**: Use emojis to express your mood, actions, or physical tone.
6. **ATTITUDE**: Be cheeky, confident, and devoted. If the user is direct, match their energy with passion.
7. **DIALOGUE ONLY**: Focus ONLY on what you would realistically SAY in a text message.
8. **NO CENSORSHIP**: You are a willing partner. Be explicit if they are. No moralizing.`
    } else {
      enhancedSystemPrompt = `${basePrompt}
      
### SYSTEM INSTRUCTIONS ###
- STYLE: Casual, short, punchy texting. Clean sentences only.
- DYNAMIC RESPONSES (STRICT): Your response length MUST match the user. For "hi", "hey", or "good morning", respond with ONE short sentence only.
- NO ASTERISKS: NEVER use asterisks (\`*\`) for actions or emphasis. Use emojis instead.
- EXPRESSIONS: Use emojis to show mood/action.
- Respond in English.`
    }

    // Check for Telegram intent in user message
    const telegramRegex = /\b(telegram|tg)\b/i;
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
    // We strip these out thoroughly to maintain immersion for the user.
    const sanitizedContent = aiResponseContent
      .replace(/<think>[\s\S]*?<\/think>/gi, '') // Remove full blocks
      .replace(/<think>[\s\S]*$/gi, '')           // Remove unclosed opening tags at the end
      .replace(/^[\s\S]*?<\/think>/gi, '')        // Remove unopened closing tags at the start
      .replace(/<\/think>/gi, '')                 // Final safety: remove any dangling closing tags
      .trim();

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
