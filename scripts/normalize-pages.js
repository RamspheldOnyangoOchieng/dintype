const { createClient } = require('@supabase/supabase-js')

require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env');

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env');

const supabase = createClient(supabaseUrl, supabaseKey)

async function normalizePage() {
  try {
    console.log('🔧 Normalizing page names to lowercase...\n')

    // First, let's see what we have
    const { data: allBlocks } = await supabase
      .from('content_blocks')
      .select('id, page, block_key')
      .limit(5)

    console.log('📋 Sample data:', JSON.stringify(allBlocks, null, 2))
    console.log()

    // Get unique page values
    const { data: allPages } = await supabase
      .from('content_blocks')
      .select('page')

    const uniquePages = [...new Set(allPages.map(b => b.page))]
    console.log('📄 Unique page values:', uniquePages)
    console.log()

    // Update each page individually
    for (const page of uniquePages) {
      if (page && page !== page.toLowerCase()) {
        const lowercase = page.toLowerCase()
        console.log(`🔄 Updating "${page}" → "${lowercase}"...`)

        const { data, error } = await supabase
          .from('content_blocks')
          .update({ page: lowercase })
          .eq('page', page)
          .select('id')

        if (error) {
          console.log(`   ❌ Error:`, error.message)
        } else {
          console.log(`   ✅ Updated ${data.length} blocks`)
        }
      } else {
        console.log(`✓ "${page}" already lowercase`)
      }
    }

    console.log('\n🎉 Done! Page names normalized.')
    console.log('   Please refresh your browser.')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

normalizePage()
