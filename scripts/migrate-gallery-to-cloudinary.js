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

async function migrateGalleryToCloudinary() {
    console.log('🚀 Starting gallery migration to Cloudinary...');

    // 1. Get gallery images with Supabase or relative image URLs
    const { data: images, error } = await supabase
        .from('character_gallery')
        .select('id, image_url');

    if (error) {
        console.error('Error fetching gallery images:', error);
        return;
    }

    console.log(`Found ${images.length} gallery images to check.`);

    for (const img of images) {
        const isSupabase = img.image_url?.includes('supabase.co');
        const isRelative = img.image_url && !img.image_url.startsWith('http');

        if (isSupabase || isRelative) {
            console.log(`📦 Migrating gallery image ${img.id}...`);
            let urlToUpload = img.image_url;

            // If relative, construct Supabase URL
            if (isRelative) {
                const path = img.image_url.startsWith('characters/') ? img.image_url : `characters/${img.image_url}`;
                const { data } = supabase.storage.from('images').getPublicUrl(path);
                urlToUpload = data.publicUrl;
            }

            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(urlToUpload, {
                    folder: 'character-galleries',
                    resource_type: 'image'
                });

                console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);

                // Update character_gallery table
                const { error: updateError } = await supabase
                    .from('character_gallery')
                    .update({
                        image_url: result.secure_url,
                        thumbnail_url: result.secure_url
                    })
                    .eq('id', img.id);

                if (updateError) {
                    console.error(`❌ Failed to update DB for image ${img.id}:`, updateError);
                } else {
                    console.log(`✨ Updated DB for image ${img.id}`);
                }
            } catch (uploadErr) {
                console.error(`❌ Failed to upload image ${img.id}:`, uploadErr.message);
            }
        }
    }

    console.log('🏁 Gallery migration complete!');
}

migrateGalleryToCloudinary();
