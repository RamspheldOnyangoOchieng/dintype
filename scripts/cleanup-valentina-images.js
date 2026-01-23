
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VALENTINA_ID = '719491d9-6b40-46c9-9bea-e890e64681c9';

async function cleanupValentinaImages() {
    console.log('Cleaning up Valentina storyline images...');

    const { data: chapters, error } = await supabase
        .from('story_chapters')
        .select('id, chapter_number, content')
        .eq('character_id', VALENTINA_ID);

    if (error) {
        console.error('Error fetching chapters:', error);
        return;
    }

    for (const chapter of chapters) {
        const images = chapter.content.chapter_images || [];
        const filteredImages = images.filter(img => img && img.startsWith('http'));

        if (images.length !== filteredImages.length) {
            console.log(`Fixing Ch ${chapter.chapter_number}: Removed ${images.length - filteredImages.length} invalid images.`);

            const newContent = {
                ...chapter.content,
                chapter_images: filteredImages
            };

            const { error: updateError } = await supabase
                .from('story_chapters')
                .update({ content: newContent })
                .eq('id', chapter.id);

            if (updateError) {
                console.error(`Error updating Ch ${chapter.chapter_number}:`, updateError);
            }
        }
    }

    console.log('Valentina cleanup complete.');
}

cleanupValentinaImages();
