const { v2: cloudinary } = require('cloudinary');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateToCloudinary() {
    console.log('🚀 Starting migration to Cloudinary...');

    // 1. Get characters with Supabase or relative image URLs
    const { data: characters, error } = await supabase
        .from('characters')
        .select('id, name, image');

    if (error) {
        console.error('Error fetching characters:', error);
        return;
    }

    for (const char of characters) {
        const isSupabase = char.image?.includes('supabase.co');
        const isRelative = char.image && !char.image.startsWith('http') && !char.image.includes('placeholder');

        if (isSupabase || isRelative) {
            console.log(`📦 Migrating ${char.name}...`);
            let urlToUpload = char.image;

            // If relative, construct Supabase URL
            if (isRelative) {
                const path = char.image.startsWith('characters/') ? char.image : `characters/${char.image}`;
                const { data } = supabase.storage.from('images').getPublicUrl(path);
                urlToUpload = data.publicUrl;
            }

            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(urlToUpload, {
                    folder: 'ai-characters',
                    resource_type: 'image'
                });

                console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);

                // Update characters table
                const { error: updateError } = await supabase
                    .from('characters')
                    .update({
                        image: result.secure_url,
                        image_url: result.secure_url // Sync both columns
                    })
                    .eq('id', char.id);

                if (updateError) {
                    console.error(`❌ Failed to update DB for ${char.name}:`, updateError);
                } else {
                    console.log(`✨ Updated DB for ${char.name}`);
                }
            } catch (uploadErr) {
                console.error(`❌ Failed to upload ${char.name} image:`, uploadErr.message);
            }
        }
    }

    console.log('🏁 Migration complete!');
}

migrateToCloudinary();
