import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const characterId = searchParams.get('characterId');

        if (!characterId) {
            return NextResponse.json({ error: 'Character ID is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const supabaseAdmin = await createAdminClient();

        // Get current user (optional - for checking unlocks)
        const { data: { user } } = await supabase.auth.getUser();

        // First, fetch the character to get its images array (profile images)
        const { data: character, error: charError } = await supabaseAdmin
            .from('characters')
            .select('images, image, user_id')
            .eq('id', characterId)
            .single();

        if (charError) {
            console.error('Error fetching character:', charError);
        }

        // Get character images from the images array
        const characterImages = character?.images || [];
        const mainImage = character?.image;
        const characterOwnerId = character?.user_id;

        // Also fetch from character_gallery table
        const { data: galleryImages, error: galleryError } = await supabaseAdmin
            .from('character_gallery')
            .select('*')
            .eq('character_id', characterId)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (galleryError) {
            console.error('Error fetching character_gallery:', galleryError);
        }

        // Also fetch from generated_images table for this character
        const { data: generatedImages, error: generatedError } = await supabaseAdmin
            .from('generated_images')
            .select('*')
            .eq('character_id', characterId)
            .order('created_at', { ascending: false });

        if (generatedError) {
            console.error('Error fetching generated_images:', generatedError);
        }

        // If user is logged in, check which images they've unlocked
        let unlockedImageIds: string[] = [];
        if (user) {
            const { data: userUnlocks } = await supabaseAdmin
                .from('user_unlocked_images')
                .select('gallery_image_id')
                .eq('user_id', user.id);

            unlockedImageIds = userUnlocks?.map(u => u.gallery_image_id) || [];
        }

        // Build a Set of all URLs we already have from gallery table
        const existingUrls = new Set((galleryImages || []).map(img => img.image_url));

        // Process all images
        const allImages: any[] = [];
        let index = 0;

        // 1. Add images from character_gallery first
        for (const img of (galleryImages || [])) {
            const isUnlockedByUser = unlockedImageIds.includes(img.id);
            const isFreePreview = img.is_free_preview;
            const isGeneratedByUser = user && img.generated_by === user.id;
            const canView = isFreePreview || isUnlockedByUser || isGeneratedByUser || !img.is_locked;

            allImages.push({
                id: img.id,
                characterId: img.character_id,
                imageUrl: canView ? img.image_url : null,
                thumbnailUrl: canView ? (img.thumbnail_url || img.image_url) : null,
                isLocked: img.is_locked && !canView,
                isNsfw: img.is_nsfw,
                unlockCost: img.unlock_cost || 100,
                isFreePreview: img.is_free_preview,
                isUnlockedByUser,
                isOwnImage: isGeneratedByUser,
                createdAt: img.created_at
            });
            existingUrls.add(img.image_url);
        }

        // 2. Add character profile images (from images array) - these are free for everyone
        for (const imgUrl of characterImages) {
            if (!existingUrls.has(imgUrl)) {
                allImages.push({
                    id: `char-img-${index++}`,
                    characterId: characterId,
                    imageUrl: imgUrl,
                    thumbnailUrl: imgUrl,
                    isLocked: false, // Profile images are always visible
                    isNsfw: false,
                    unlockCost: 0,
                    isFreePreview: true,
                    isUnlockedByUser: true,
                    isOwnImage: false,
                    createdAt: new Date().toISOString()
                });
                existingUrls.add(imgUrl);
            }
        }

        // 3. Also add main image if not already included
        if (mainImage && !existingUrls.has(mainImage)) {
            allImages.unshift({
                id: `char-main`,
                characterId: characterId,
                imageUrl: mainImage,
                thumbnailUrl: mainImage,
                isLocked: false,
                isNsfw: false,
                unlockCost: 0,
                isFreePreview: true,
                isUnlockedByUser: true,
                isOwnImage: false,
                createdAt: new Date().toISOString()
            });
            existingUrls.add(mainImage);
        }

        // 4. Add generated images that are not already included - these are locked for others
        for (const img of (generatedImages || [])) {
            if (!existingUrls.has(img.image_url)) {
                const isGeneratedByUser = user && img.user_id === user.id;
                const isUnlocked = unlockedImageIds.includes(img.id);
                const canView = isGeneratedByUser || isUnlocked;

                allImages.push({
                    id: img.id,
                    characterId: characterId,
                    imageUrl: canView ? img.image_url : null,
                    thumbnailUrl: canView ? img.image_url : null,
                    isLocked: !canView,
                    isNsfw: false,
                    unlockCost: 100,
                    isFreePreview: false,
                    isUnlockedByUser: isUnlocked,
                    isOwnImage: isGeneratedByUser,
                    createdAt: img.created_at
                });
                existingUrls.add(img.image_url);
            }
        }

        // Count stats
        const totalImages = allImages.length;
        const unlockedCount = allImages.filter(img => !img.isLocked).length;
        const lockedCount = totalImages - unlockedCount;

        return NextResponse.json({
            images: allImages,
            stats: {
                total: totalImages,
                unlocked: unlockedCount,
                locked: lockedCount
            }
        });

    } catch (error) {
        console.error('Gallery API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
