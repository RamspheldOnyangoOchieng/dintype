# 🔄 Auto-Save System Implementation

## Overview
Automatic image saving has been implemented across all chat sessions - both web and Telegram bot. The system intelligently detects when a user is in an active conversation and automatically saves generated images to their collection.

## 📱 How It Works

### Web Chat Sessions
**Detection:**
- When you enter a chat (`/chat/[id]`), the system sets:
  - `chat_session_active = true`
  - `chat_auto_save_enabled = true`

**Auto-Save Process:**
1. User requests an image in chat
2. System checks localStorage flags
3. If both flags are `true`, auto-save is enabled
4. Image is generated via `/api/img2img`
5. Status is checked via `/api/check-generation` with auto-save params
6. Upon success, image is automatically saved to `generated_images` table

**Session End:**
- When you leave the chat page, both flags are removed
- Auto-save is disabled for standalone generation
- Manual save preference is restored

### Telegram Bot Sessions
**Always Active:**
- All images generated in Telegram chat are automatically saved
- Source is marked as `'telegram'` for tracking
- No manual intervention required

## 🗃️ Database Structure

Images are saved to the `generated_images` table with:
```typescript
{
  user_id: string,           // User who generated the image
  character_id: string|null, // Associated character (if any)
  image_url: string,         // Novita CDN URL
  prompt: string,            // Original or enhanced prompt
  source: 'chat'|'telegram', // Generation source
  created_at: timestamp      // When it was created
}
```

## 🔍 Console Logging

### Web Chat
- 🔵 "Chat session started - Auto-save enabled"
- 🔴 "Chat session ended - Auto-save disabled"
- 💾 "Auto-save check: { isChatSessionActive, autoSaveEnabled, shouldAutoSave }"
- ✅ "Auto-saved X image(s) to collection"
- ❌ "Auto-save failed: [error]"

### Telegram Bot
- 💾 "[Telegram] Auto-saving image for user: [id]"
- ✅ "[Telegram] Image auto-saved to collection"
- ❌ "[Telegram] Auto-save failed: [error]"

## 🎯 Key Features

1. **Session-Based Detection**: Auto-save only activates during active chat sessions
2. **Automatic Cleanup**: Flags are cleared when leaving chat
3. **Error Resilience**: Failed auto-saves don't break image generation
4. **Source Tracking**: Images are tagged with their origin (chat/telegram)
5. **Character Association**: Images link to the character they were generated with
6. **Prompt Preservation**: Original prompts are saved for reference

## 🧪 Testing

To verify auto-save is working:
1. Open browser console (F12)
2. Navigate to `/chat/[character-id]`
3. Look for: 🔵 "Chat session started - Auto-save enabled"
4. Generate an image
5. Watch for: 💾 "Auto-save check: { ... shouldAutoSave: true }"
6. After generation: ✅ "Auto-saved 1 image(s) to collection"
7. Navigate away from chat
8. Look for: 🔴 "Chat session ended - Auto-save disabled"

## 🔧 Modified Files

1. **app/chat/[id]/page.tsx**
   - Added session management useEffect
   - Enhanced generateImage with auto-save checks
   - Updated checkImageStatus to pass auto-save params

2. **app/api/check-generation/route.ts**
   - Added auto-save logic on success
   - Reads userId, autoSave, characterId, prompt from query params
   - Saves to `generated_images` table

3. **app/api/webhooks/telegram/route.ts**
   - Enhanced error handling for auto-save
   - Added detailed logging
   - Added timestamp to saved images

## 💡 Future Enhancements

- [ ] User preference to disable auto-save
- [ ] Auto-save quota for free users
- [ ] Duplicate detection before saving
- [ ] Automatic image cleanup (old images)
- [ ] Collection organization by character/date
