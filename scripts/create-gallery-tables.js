const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function createGalleryTables() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // 1. Drop existing tables if they have issues
        await client.query(`DROP TABLE IF EXISTS user_unlocked_images CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS character_gallery CASCADE;`);
        console.log('✅ Dropped old tables');

        // 2. Create character_gallery table - stores all gallery images for characters
        await client.query(`
            CREATE TABLE character_gallery (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                character_id UUID NOT NULL,
                image_url TEXT NOT NULL,
                thumbnail_url TEXT,
                is_locked BOOLEAN DEFAULT true,
                is_nsfw BOOLEAN DEFAULT false,
                unlock_cost INTEGER DEFAULT 100,
                generated_by UUID,
                is_admin_uploaded BOOLEAN DEFAULT false,
                is_free_preview BOOLEAN DEFAULT false,
                is_primary BOOLEAN DEFAULT false,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ Created character_gallery table');

        // 3. Create user_unlocked_images table - tracks which images users have unlocked
        await client.query(`
            CREATE TABLE user_unlocked_images (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                gallery_image_id UUID NOT NULL REFERENCES character_gallery(id) ON DELETE CASCADE,
                tokens_spent INTEGER DEFAULT 100,
                unlocked_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, gallery_image_id)
            );
        `);
        console.log('✅ Created user_unlocked_images table');

        // 4. Create indexes for performance
        await client.query(`
            CREATE INDEX idx_character_gallery_character_id ON character_gallery(character_id);
            CREATE INDEX idx_character_gallery_locked ON character_gallery(is_locked);
            CREATE INDEX idx_user_unlocked_user_id ON user_unlocked_images(user_id);
            CREATE INDEX idx_user_unlocked_gallery_id ON user_unlocked_images(gallery_image_id);
        `);
        console.log('✅ Created indexes');

        // 5. Enable RLS on both tables
        await client.query(`
            ALTER TABLE character_gallery ENABLE ROW LEVEL SECURITY;
            ALTER TABLE user_unlocked_images ENABLE ROW LEVEL SECURITY;
        `);
        console.log('✅ Enabled RLS');

        // 6. Create permissive RLS policies for character_gallery
        await client.query(`
            CREATE POLICY "Anyone can view character gallery"
                ON character_gallery FOR SELECT
                USING (true);

            CREATE POLICY "Authenticated users can insert gallery images"
                ON character_gallery FOR INSERT
                WITH CHECK (true);

            CREATE POLICY "Admins can update gallery"
                ON character_gallery FOR UPDATE
                USING (true);

            CREATE POLICY "Admins can delete gallery"
                ON character_gallery FOR DELETE
                USING (true);
        `);
        console.log('✅ Created RLS policies for character_gallery');

        // 7. Create RLS policies for user_unlocked_images
        await client.query(`
            CREATE POLICY "Users can view their unlocked images"
                ON user_unlocked_images FOR SELECT
                USING (true);

            CREATE POLICY "Users can unlock images"
                ON user_unlocked_images FOR INSERT
                WITH CHECK (true);
        `);
        console.log('✅ Created RLS policies for user_unlocked_images');

        console.log('\n🎉 All gallery tables created successfully!');

    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await client.end();
    }
}

createGalleryTables();
