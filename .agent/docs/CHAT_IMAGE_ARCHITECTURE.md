# Dintype.se - Chat & Image Generation Architecture

## Overview

This document explains **how**, **when**, **what**, and **where** to apply changes in the Dintype.se chat and image generation system.

---

## 1. THE CHAT MESSAGE FLOW

### When a user sends a message:

```
[User types message] 
    → app/chat/[id]/page.tsx (handleSendMessage)
    → lib/chat-actions-db.ts (sendChatMessageDB)
    → AI API (Novita/OpenAI)
    → Response saved to DB
    → UI updated
```

### Key Files:

| File | Purpose | When to Edit |
|------|---------|--------------|
| `app/chat/[id]/page.tsx` | UI logic, message display, button handlers | Changing UI behavior, adding buttons, modifying what appears on screen |
| `lib/chat-actions-db.ts` | Core AI logic, system prompts, message saving | Changing AI behavior, personality, response style, length limits |
| `lib/chat-actions.ts` | Legacy non-DB chat actions | Rarely used now, deprecated |

### System Prompt Construction (lib/chat-actions-db.ts):

The AI's behavior is controlled by the **system prompt**. Here's the hierarchy:

```
1. Character's own system_prompt (from database)
2. Story context (if in storyline mode)
3. Premium/Free user instructions (dynamically added)
4. Special triggers (Telegram request, image request, etc.)
```

**WHERE TO EDIT AI PERSONALITY:**
- Lines 303-330 in `lib/chat-actions-db.ts`
- This is where Premium vs Free instructions are defined
- Rules like "no asterisks", "match user length", etc. go here

---

## 2. THE IMAGE GENERATION FLOW

### When a user asks for an image:

```
[User: "send me a selfie"]
    → isAskingForImage() detects image request
    → If in storyline: Return pre-loaded chapter image
    → If NOT in storyline: Trigger AI generation
        → app/api/generate-image/route.ts (main generation)
        → Novita API called
        → Image URL returned
        → handleSaveImage() saves to Cloudinary + DB
```

### Key Files:

| File | Purpose | When to Edit |
|------|---------|--------------|
| `lib/image-utils.ts` | `isAskingForImage()` - detects if user wants an image | Adding new trigger phrases like "selfie", "photo", etc. |
| `app/api/generate-image/route.ts` | Main image generation API | Changing prompts, models, negative prompts, twinning logic |
| `app/api/img2img/route.ts` | Image-to-image regeneration | Same as above but for regenerating existing images |
| `lib/novita-api.ts` | Low-level Novita API wrapper | Rarely touched - only for API-level changes |

### Prompt Enhancement (app/api/generate-image/route.ts):

The user's simple prompt like "send me a selfie" gets enhanced:

```
User prompt: "send me a selfie"
    ↓
AI Enhancement (lines 350-435): "### MASTER TRAITS: Maze, blonde hair, blue eyes..."
    ↓
Final prompt sent to Novita
```

**WHERE TO EDIT IMAGE QUALITY:**
- `DEFAULT_NEGATIVE_PROMPT` (line 25) - things to avoid in images
- Twinning logic (lines 417-427) - ensuring character consistency
- `lib/novita-api.ts` line 51-53 - base prompt templates

---

## 3. THE DAILY GREETING SYSTEM

### When it triggers:

```
User opens chat for first time today
    → localStorage checked: last_daily_msg_{characterId}
    → If not today's date:
        → Send morning greeting message
        → If storyline active: Also send a chapter image
```

### Key Location:
- `app/chat/[id]/page.tsx` lines 380-450
- Function: `checkTriggerDailyMessage()`

**WHEN TO EDIT:**
- Changing the greeting text
- Disabling daily messages entirely
- Adding different greeting types (evening, weekend, etc.)

---

## 4. STORYLINE vs FREE ROAM MODE

### How it's determined:

```
User opens chat
    ↓
Check user_story_progress table
    ↓
If progress exists AND is_completed = false:
    → STORYLINE MODE (restricted)
    → Image generation uses chapter_images only
    → AI follows chapter context strictly
    ↓
If no progress OR is_completed = true:
    → FREE ROAM MODE
    → Full AI image generation enabled
    → No storyline restrictions
```

### Key Files:

| File | Purpose |
|------|---------|
| `lib/story-mode.ts` | Story progress functions |
| `lib/chat-actions-db.ts` lines 135-210 | Storyline image restrictions in chat |
| `app/api/webhooks/telegram/route.ts` | Same restrictions for Telegram |

---

## 5. CHARACTER DATA (Twinning)

### Where character traits come from:

```
Character selected
    ↓
Fetched from 'characters' table
    ↓
Fields used for twinning:
    - name
    - hair_color (or hairColor)
    - eye_color (or eyeColor)
    - skin_tone (or skinTone)
    - ethnicity
    - image (primary)
    - images[] (gallery)
```

### Key Issue: Snake_case vs CamelCase

The database uses `hair_color` but the frontend expects `hairColor`. The `character-context.tsx` file has helper functions (`snakeToCamel`) to convert between them.

**WHERE TO UPDATE CHARACTER TRAITS:**
- Supabase dashboard → characters table
- Or scripts like `scripts/fix-maze-blonde.js`
- Admin panel: `app/admin/dashboard/characters/edit/[id]/page.tsx`

---

## 6. RESPONSE LENGTH & STYLE CONTROL

### Where rules are defined:

| Rule | File | Lines |
|------|------|-------|
| "Match user length" | `lib/chat-actions-db.ts` | 315 |
| "No asterisks" | `lib/chat-actions-db.ts` | 316 |
| "Use emojis" | `lib/chat-actions-db.ts` | 318 |
| "No censorship (premium)" | `lib/chat-actions-db.ts` | 321 |
| Telegram-specific rules | `app/api/webhooks/telegram/route.ts` | 124-143 |

### Premium vs Free Differences:

| Feature | Free | Premium |
|---------|------|---------|
| History limit | 20 messages | 100-400 messages |
| Max tokens | 150 | 300 |
| Temperature | 0.7 (stable) | 0.85 (creative) |
| NSFW | Blocked | Allowed |
| Model | deepseek-r1 | deepseek-r1 |

---

## 7. QUICK REFERENCE: COMMON CHANGES

| I want to... | Edit this file | Look for... |
|--------------|----------------|-------------|
| Change AI personality | `lib/chat-actions-db.ts` | `enhancedSystemPrompt` |
| Change image quality | `app/api/generate-image/route.ts` | `DEFAULT_NEGATIVE_PROMPT` |
| Fix character appearance | Supabase `characters` table | `hair_color`, `eye_color`, etc. |
| Change daily greeting | `app/chat/[id]/page.tsx` | `checkTriggerDailyMessage` |
| Add image trigger phrases | `lib/image-utils.ts` | `isAskingForImage` |
| Change twinning strength | `app/api/generate-image/route.ts` | `characterPrefix` variable |
| Modify Telegram bot | `app/api/webhooks/telegram/route.ts` | Full file |

---

## 8. DEBUGGING TIPS

### Check AI response issues:
1. Open browser DevTools → Network tab
2. Look for `/api/messages` or chat completions call
3. Check the `system` prompt being sent
4. Check the response content

### Check image generation issues:
1. Look at Vercel/server logs
2. Check `/api/generate-image` response
3. Verify character data has correct `hairColor`, `eyeColor`, etc.

### Check old cached messages appearing:
1. Clear localStorage: `localStorage.clear()` in browser console
2. Or clear specific character: `localStorage.removeItem('chat_history_{characterId}')`
3. Database cleanup: Run `scripts/clean-asterisk-messages.js`

---

## 9. ENVIRONMENT VARIABLES

| Variable | Purpose |
|----------|---------|
| `NOVITA_API_KEY` | AI and image generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Database connection |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB access |
| `CLOUDINARY_*` | Permanent image storage |
| `TELEGRAM_BOT_TOKEN` | Telegram bot |

---

This document should help you understand the system architecture and know exactly where to make changes for any feature or fix.
