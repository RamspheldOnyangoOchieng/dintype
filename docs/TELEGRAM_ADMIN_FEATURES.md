# Admin Panel - Telegram Integration Features

This document describes the new Telegram-related admin features added to the PocketLove admin panel.

## New Admin Pages

### 1. Telegram Profile Images Management
**Location:** `/admin/dashboard/telegram-profiles`

**Features:**
- View all Telegram users registered in the system
- Search profiles by username, name, or Telegram ID
- Upload profile images for users
- Delete existing profile images
- Real-time image preview before upload
- Integration with Cloudinary for image storage

**Usage:**
1. Navigate to "Telegram Profiles" in the admin sidebar
2. Use the search bar to filter users
3. Click "Upload" on a user card to add/change their profile image
4. Click the trash icon to remove a profile image

**Database Table:** `telegram_users`
Required columns:
- `id` (UUID, primary key)
- `telegram_user_id` (TEXT, unique)
- `username` (TEXT, nullable)
- `first_name` (TEXT, nullable)
- `last_name` (TEXT, nullable)
- `profile_image_url` (TEXT, nullable)
- `bio` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

### 2. Telegram Mini App Management
**Location:** `/admin/dashboard/mini-app`

**Features:**
- Enable/disable the entire mini app
- Configure bot settings (username, app name, description)
- Customize appearance (theme colors, header, background, buttons)
- Toggle individual features (character selection, image generation, etc.)
- View real-time statistics:
  - Total users
  - Active users today
  - Total interactions
  - Character selections
- Integration instructions and links

**Configuration Sections:**

#### General Settings
- Enable/disable mini app
- Bot username configuration
- App name and short name
- Description text

#### Appearance
- Theme color
- Header color
- Background color
- Button color
- Button text color

#### Features
Toggle switches for:
- Character selection
- Image generation
- Character creation
- Premium features

#### Integration
- Mini app URL for Telegram
- BotFather setup instructions
- Quick links to documentation

---

## API Endpoints

### Telegram Stats
**Endpoint:** `/api/telegram/stats`
**Method:** GET
**Auth:** Admin only

**Response:**
```json
{
  "total_users": 0,
  "active_today": 0,
  "total_interactions": 0,
  "character_selections": 0
}
```

---

## Database Requirements

### Required Tables

#### telegram_users
```sql
CREATE TABLE telegram_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  bio TEXT,
  active_character_id UUID REFERENCES characters(id),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_telegram_users_telegram_id ON telegram_users(telegram_user_id);
CREATE INDEX idx_telegram_users_last_active ON telegram_users(last_active_at);
```

### Settings Storage
Mini app settings are stored in the `admin_settings` table with key `telegram_mini_app`.

---

## Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## Navigation

Both pages are accessible from the admin sidebar:
- **Telegram Profiles** - Icon: UserCircle
- **Mini App Management** - Icon: Smartphone

Located after "Users" section in the navigation menu.

---

## Permissions

Both pages require admin access:
- User must be authenticated
- User must have `is_admin` set to `true` in their profile
- Non-admin users are redirected to `/admin/login`

---

## Future Enhancements

Potential improvements:
- Bulk profile image upload
- Advanced analytics dashboard
- Webhook management
- Bot command configuration UI
- A/B testing for mini app features
- User segmentation and targeting

---

## Troubleshooting

### Images not uploading
- Check Cloudinary credentials in environment variables
- Verify upload preset exists in Cloudinary dashboard
- Check browser console for errors

### Stats not loading
- Ensure `telegram_users` table exists
- Verify admin permissions
- Check API route `/api/telegram/stats` is accessible

### Settings not saving
- Verify `admin_settings` table exists
- Check browser network tab for API errors
- Ensure proper admin authentication
