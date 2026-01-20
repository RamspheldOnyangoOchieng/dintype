const { createClient } = require('@supabase/supabase-js')

require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env');

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env');

const supabase = createClient(supabaseUrl, supabaseKey)

async function listAllBlocks() {
  try {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('page, block_key, content_sv')
      .order('page', { ascending: true })
      .order('block_key', { ascending: true })

    if (error) {
      console.log('❌ Error:', error.message)
      return
    }

    console.log(`\n📊 Total blocks: ${data.length}\n`)

    // Group by page
    const byPage = {}
    data.forEach(block => {
      if (!byPage[block.page]) byPage[block.page] = []
      byPage[block.page].push(block)
    })

    console.log('📋 Content Blocks by Page:\n')
    Object.keys(byPage).forEach(page => {
      console.log(`\n📄 ${page.toUpperCase()} (${byPage[page].length} blocks):`)
      byPage[page].forEach(block => {
        console.log(`   • ${block.block_key}: "${block.content_sv?.substring(0, 50)}..."`)
      })
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

listAllBlocks()
